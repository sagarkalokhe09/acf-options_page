import React, { createRef, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap'
import { Loading } from '@dhruv-techapps/core-components'
import { LOCAL_STORAGE_KEY, defaultAction, defaultConfig } from '@dhruv-techapps/acf-common'
import { ElementUtil, ExportService, StorageService } from '@dhruv-techapps/core-common'

import Config from './config'
import Batch from './batch'
import Action from './action'
import { Format, GTAG, ThreeDots, getConfigName } from '../../util'
import { DropdownToggle, ErrorAlert, GoogleAds } from '../../components'
import { ActionSettingsModal, AddonModal, ConfigSettingsModal, ConfirmModal, ReorderConfigsModal } from '../../modal'

const Configs = ({ toastRef }) => {
  const [configs, setConfigs] = useState([{ ...defaultConfig }])
  const [scroll, setScroll] = useState(false)
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const config = configs[selected]
  const didMountRef = useRef(true)
  const addonRef = useRef()
  const actionSettingsRef = useRef()
  const configSettingsRef = useRef()
  const reorderConfigsRef = useRef()
  const confirmRef = useRef()
  const importFiled = createRef()

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.pageYOffset >= 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const checkQueryParams = _configs => {
    const object = {}
    let selectedConfigIndex = 0
    if (window.location.search) {
      const params = window.location.search.replace('?', '').split('&')
      Object.values(params).forEach(param => {
        const [name, value] = param.split('=')
        object[name] = decodeURIComponent(value)
      })
      if (object.url) {
        selectedConfigIndex = _configs.findIndex(_config => _config.url === object.url)
        if (selectedConfigIndex === -1 && object.elementFinder) {
          const newConfig = { ...defaultConfig, name: 'getautoclicker.com' }
          newConfig.url = object.url
          newConfig.actions[0].elementFinder = object.elementFinder
          _configs.push(newConfig)
          selectedConfigIndex = _configs.length - 1
        } else if (object.error) {
          const XPathIndex = _configs[selectedConfigIndex].actions.findIndex(action => action.elementFinder === object.elementFinder)
          if (XPathIndex !== -1) {
            _configs[selectedConfigIndex].actions[XPathIndex].error = 'elementFinder'
          }
        } else if (object.elementFinder) {
          const XPathIndex = _configs[selectedConfigIndex].actions.findIndex(action => action.elementFinder === object.elementFinder)
          if (XPathIndex === -1) {
            const action = { ...defaultAction }
            action.elementFinder = object.elementFinder
            _configs[selectedConfigIndex].actions.push(action)
          }
        }
      }
    }
    return selectedConfigIndex
  }

  useEffect(() => {
    StorageService.getItem(LOCAL_STORAGE_KEY.CONFIGS, [{ ...defaultConfig }])
      .then(_configs => {
        _configs = _configs === null || _configs === 'null' || _configs === 'undefined' ? [{ ...defaultConfig }] : _configs
        setSelected(checkQueryParams(_configs))
        setConfigs(_configs)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    StorageService.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [configs])

  const onChange = e => {
    setSelected(ElementUtil.getValue(e.currentTarget))
  }

  const addConfig = () => {
    const name = getConfigName(undefined, configs.length)
    setConfigs([...configs, { ...defaultConfig, name }])
    toastRef.current.push({
      body: (
        <p>
          <Badge variant='success'>{name}</Badge> added successfully{' '}
        </p>
      ),
      header: <strong className='mr-auto'>Configuration</strong>
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Add' })
  }

  const removeConfig = () => {
    const { name } = configs[selected]
    setLoading(true)
    setConfigs(configs.filter((_, index) => index !== selected))
    setSelected(prevSelected => {
      if (configs.length === 2) {
        return 0
      }
      return prevSelected === 0 ? prevSelected : prevSelected - 1
    })
    setLoading(false)
    toastRef.current.push({
      body: (
        <p>
          <span className='badge badge-danger'>{name}</span> removed successfully
        </p>
      ),
      header: <strong className='mr-auto'>Configuration</strong>
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Remove Confirmation' })
  }

  const removeConfigConfirm = () => {
    const name = configs[selected].name || configs[selected].url || `configuration-${selected}`
    confirmRef.current.confirm({
      title: 'Remove Configuration',
      message: (
        <p>
          Are you sure to remove <span className='badge badge-danger'>{name}</span> Configuration?
        </p>
      ),
      confirmFunc: removeConfig
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Remove' })
  }

  const exportAll = () => {
    ExportService.export('All Configurations', configs).catch(_error => {
      toastRef.current.push({
        body: JSON.stringify(_error),
        header: <strong className='mr-auto'>Export Error</strong>,
        bodyClass: 'text-danger'
      })
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Export All' })
  }

  const importAll = e => {
    const { files } = e.currentTarget
    if (files.length <= 0) {
      return false
    }
    const fr = new FileReader()
    fr.onload = function ({ target }) {
      try {
        setLoading(true)
        const result = JSON.parse(target.result)
        if (Array.isArray(result)) {
          setConfigs(Format.configurations(result))
          setSelected(0)
          GTAG.event({ category: 'Configuration', action: 'Click', label: 'Import All' })
        } else {
          toastRef.current.push({
            body: 'selected Json is not valid',
            header: <strong className='mr-auto'>Import Error</strong>,
            bodyClass: 'text-danger'
          })
          GTAG.exception({ description: 'selected Json is not valid', fatal: false })
        }
        setLoading(false)
      } catch (_error) {
        console.error(_error)
        GTAG.exception({ description: _error, fatal: true })
      }
    }
    fr.readAsText(files.item(0))
    return false
  }
  const className = scroll ? 'shadow' : ' mb-4'
  return (
    <>
      {loading ? (
        <Loading className='d-flex justify-content-center m-5' />
      ) : (
        <>
          <div id='configs' className={className}>
            <Container fluid>
              <Row>
                <Col className='px-0'>
                  <Form>
                    <Form.Group controlId='selected' className='mb-0'>
                      <Form.Control as='select' custom onChange={onChange} value={selected} data-type='number'>
                        {configs.map((_config, index) => (
                          <option key={index} value={index}>
                            {_config.name || getConfigName(_config.url, index)} {!_config.enable && '(Disabled)'} --- {_config.url}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </Col>
                <Col md='auto' className='d-flex align-items-center px-0'>
                  <Button type='button' variant='outline-success' onClick={addConfig}>
                    Add Configuration
                  </Button>
                  <Dropdown alignRight>
                    <Dropdown.Toggle as={DropdownToggle} id='configs-dropdown'>
                      <ThreeDots width='24' height='24' />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={exportAll}>Export All</Dropdown.Item>
                      <Dropdown.Item onClick={() => importFiled.current.click()}>Import All</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={() => {
                          reorderConfigsRef.current.showReorder()
                        }}>
                        Reorder Configurations
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={removeConfigConfirm} className={configs.length === 1 ? 'text-muted' : 'text-danger'} disabled={configs.length === 1}>
                        Remove Configuration
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <div className='custom-file d-none'>
                    <label className='custom-file-label' htmlFor='import-configurations' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
                      Import All
                      <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-configurations' onChange={importAll} />
                    </label>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <main>
            <Container fluid>
              <Row>
                <Col>
                  {error && <ErrorAlert message={error} />}
                  <GoogleAds client={process.env.REACT_APP_GOOGLE_ADS_CLIENT} slot={process.env.REACT_APP_GOOGLE_ADS_SLOT} format='auto' className='mb-3' />
                </Col>
              </Row>
              <Config config={config} configIndex={selected} toastRef={toastRef} setConfigs={setConfigs} configSettingsRef={configSettingsRef} />
              <Batch batch={config.batch} configEnable={config.enable} configIndex={selected} setConfigs={setConfigs} />
              <Action
                actions={config.actions}
                configEnable={config.enable}
                configIndex={selected}
                toastRef={toastRef}
                setConfigs={setConfigs}
                addonRef={addonRef}
                actionSettingsRef={actionSettingsRef}
              />
            </Container>
            <AddonModal ref={addonRef} configIndex={selected} setConfigs={setConfigs} />
            <ConfirmModal ref={confirmRef} />
            <ActionSettingsModal ref={actionSettingsRef} configIndex={selected} setConfigs={setConfigs} />
            <ConfigSettingsModal ref={configSettingsRef} config={config} configIndex={selected} setConfigs={setConfigs} />
            <ReorderConfigsModal ref={reorderConfigsRef} />
          </main>
        </>
      )}
    </>
  )
}
Configs.propTypes = {
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired
}
export default Configs
