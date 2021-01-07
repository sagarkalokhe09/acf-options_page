import React, { createRef, useEffect, useRef, useState } from 'react'

import Config from './config'
import Batch from './batch'
import Action from './action'
import AddonModal from './action/addon.modal'

import { Row, Col, Button, Form, Dropdown, Card, Badge } from 'react-bootstrap'
import { ReactComponent as ThreeDotsVertical } from 'bootstrap-icons/icons/three-dots-vertical.svg'

import { defaultAction, defaultConfig, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { StorageService, ExportService, ElementUtil } from '@dhruv-techapps/core-common'
import { Loading } from '@dhruv-techapps/core-components'

import { DropdownToggle } from '../components/DropdownToggle'
import { getConfigName } from '../util/helper'
import ConfirmModal from '../components/ConfirmModal'
import ActionSettingsModal from './action/action-settings.modal'
import { ErrorAlert } from '../components/error.alert'
import GTAG from '../gtag'

const Configs = ({ toastRef }) => {
  const [configs, setConfigs] = useState([{ ...defaultConfig }])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const config = configs[selected]
  const didMountRef = useRef(true)
  const addonRef = useRef()
  const actionSettingsRef = useRef()
  const confirmRef = useRef()
  const importFiled = createRef()

  useEffect(() => {
    StorageService.getItem(LOCAL_STORAGE_KEY.CONFIGS, [{ ...defaultConfig, name: '' }]).then(_configs => {
      setSelected(checkQueryParams(_configs))
      setConfigs(_configs)
    }).catch(setError).finally(_ => setLoading(false))
  }, [])

  const checkQueryParams = (configs) => {
    const object = {}
    let selectedConfigIndex = 0
    if (window.location.search) {
      const params = window.location.search.replace('?', '').split('&')
      for (const index in params) {
        const [name, value] = params[index].split('=')
        object[name] = decodeURIComponent(value)
      }
      if (object.url) {
        selectedConfigIndex = configs.findIndex(config => config.url === object.url)
        if (selectedConfigIndex === -1 && object.elementFinder) {
          const config = { ...defaultConfig, name: 'getautoclicker.com' }
          config.url = object.url
          config.actions[0].elementFinder = object.elementFinder
          configs.push(config)
          selectedConfigIndex = configs.length - 1
        } else if (object.error) {
          const XPathIndex = configs[selectedConfigIndex].actions.findIndex(action => action.elementFinder === object.elementFinder)
          if (XPathIndex !== -1) {
            configs[selectedConfigIndex].actions[XPathIndex].error = 'elementFinder'
          }
        } else if (object.elementFinder) {
          const XPathIndex = configs[selectedConfigIndex].actions.findIndex(action => action.elementFinder === object.elementFinder)
          if (XPathIndex === -1) {
            const action = { ...defaultAction }
            action.elementFinder = object.elementFinder
            configs[selectedConfigIndex].actions.push(action)
          }
        }
      }
    }
    return selectedConfigIndex
  }

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    StorageService.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs).catch(setError).finally(_ => setLoading(false))
  }, [configs])

  const onChange = (e) => {
    setSelected(ElementUtil.getValue(e.currentTarget))
  }

  const addConfig = () => {
    const name = getConfigName(undefined, configs.length)
    setConfigs([...configs, { ...defaultConfig, name }])
    toastRef.current.push({
      body: <p><Badge variant='success'>{name}</Badge> added successfully </p>,
      header: <strong className='mr-auto'>Configuration</strong>
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Add' })
  }

  const removeConfig = () => {
    const name = configs[selected].name
    setLoading(true)
    setConfigs(configs.filter((_config, index) => index !== selected))
    setSelected(selected => configs.length === 2 ? 0 : selected === 0 ? selected : selected - 1)
    setLoading(false)
    toastRef.current.push({
      body: <p><span className='badge badge-danger'>{name}</span> removed successfully</p>,
      header: <strong className='mr-auto'>Configuration</strong>
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Remove Confirmation' })
  }

  const removeConfigConfirm = () => {
    const name = configs[selected].name || configs[selected].url || `configuration-${selected}`
    confirmRef.current.confirm({
      title: 'Remove Configuration',
      message: <p>Are you sure to remove <span className='badge badge-danger'>{name}</span> Configuration?</p>,
      confirmFunc: removeConfig
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Remove' })
  }

  const exportAll = () => {
    ExportService.export('All Configurations', configs).catch(error => {
      toastRef.current.push({
        body: JSON.stringify(error),
        header: <strong className='mr-auto'>Export Error</strong>,
        bodyClass: 'text-danger'
      })
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Export All' })
  }

  const importAll = (e) => {
    var files = e.currentTarget.files
    if (files.length <= 0) {
      return false
    }
    var fr = new FileReader()
    fr.onload = function (e) {
      try {
        setLoading(true)
        const result = JSON.parse(e.target.result)
        if (Array.isArray(result)) {
          setConfigs(result)
          setSelected(0)
          GTAG.event({ category: 'Configuration', action: 'Click', label: 'Import All' })
        } else {
          toastRef.current.push({
            body: 'selected Json is not array',
            header: <strong className='mr-auto'>Import Error</strong>,
            bodyClass: 'text-danger'
          })
          GTAG.exception({ description: 'selected Json is not array', fatal: true })
        }
        setLoading(false)
      } catch (error) {
        console.error(error)
        GTAG.exception({ description: error, fatal: true })
      }
    }
    fr.readAsText(files.item(0))
  }

  return <>
    {loading ? <Loading className='d-flex justify-content-center m-5' />
      : <>
        {error && <ErrorAlert message={error}></ErrorAlert> }
        <Card className='mb-3'>
          <Card.Body>
            <Row >
              <Col>
                <Form>
                  <Form.Group controlId='selected' className='mb-0'>
                    <Form.Control as='select' custom onChange={onChange} value={selected} data-type='number'>
                      {configs.map((config, index) => <option key={index} value={index}>{config.name || getConfigName(config.url, index)}</option>)}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
              <Col md='auto' className='d-flex align-items-center'>
                <Button type='button' variant='success' onClick={addConfig}>Add Configuration</Button>
                <Dropdown className='ml-3' alignRight>
                  <Dropdown.Toggle as={DropdownToggle} id='dropdown-basic'>
                    <ThreeDotsVertical width='24' height='24' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={exportAll}>Export All</Dropdown.Item>
                    <Dropdown.Item onClick={_ => importFiled.current.click()}>Import All</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={removeConfigConfirm} className={configs.length === 1 ? 'text-muted' : 'text-danger'} disabled={configs.length === 1}>Remove Configuration</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="custom-file d-none">
                  <input type="file" className="custom-file-input" ref={importFiled} accept=".json" id="import-configurations" onChange={importAll} />
                  <label className="custom-file-label" htmlFor="import-configurations" style={{ fontSize: 1 + 'rem', fontWeight: 400 }}>Import All</label>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Config config={config} configIndex={selected} toastRef={toastRef} setConfigs={setConfigs} />
        <ConfirmModal ref={confirmRef} />
        <Batch batch={config.batch} configEnable={config.enable} configIndex={selected} setConfigs={setConfigs} />
        <Action actions={config.actions} configEnable={config.enable} configIndex={selected} toastRef={toastRef} setConfigs={setConfigs} addonRef={addonRef} actionSettingsRef={actionSettingsRef} />
        <AddonModal ref={addonRef} configIndex={selected} setConfigs={setConfigs} />
        <ActionSettingsModal ref={actionSettingsRef} configIndex={selected} setConfigs={setConfigs} />
      </>}
  </>
}
Configs.propTypes = {
  toastRef: Action.type.propTypes.toastRef
}
export default Configs
