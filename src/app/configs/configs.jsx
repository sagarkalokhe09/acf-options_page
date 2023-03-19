import React, { createRef, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap'
import { LOCAL_STORAGE_KEY, defaultAction, defaultConfig } from '@dhruv-techapps/acf-common'
import { ElementUtil, Logger } from '@dhruv-techapps/core-common'
import { StorageService } from '@dhruv-techapps/core-services'
import { useTranslation } from 'react-i18next'
import Config from './config'
import Batch from './batch'
import Action from './action'
import { Format, ThreeDots, getConfigName } from '../../util'
import { Ads, DropdownToggle, ErrorAlert, Loading, Sponsors } from '../../components'
import { ActionSettingsModal, AddonModal, ConfigSettingsModal, ReorderConfigsModal, RemoveConfigsModal, ActionConditionModal } from '../../modal'
import { ModeContext } from '../../_providers'
import { download } from '../../_helpers'

function Configs({ toastRef, blogRef, confirmRef }) {
  const { mode } = useContext(ModeContext)
  const [configs, setConfigs] = useState([{ ...defaultConfig }])
  const [scroll, setScroll] = useState(false)
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState()
  const [error, setError] = useState()
  const config = configs[selected]
  const didMountRef = useRef(true)
  const addonRef = useRef()
  const actionSettingsRef = useRef()
  const actionConditionRef = useRef()
  const configSettingsRef = useRef()
  const reorderConfigsRef = useRef()
  const removeConfigsRef = useRef()

  const importFiled = createRef()

  const { t, i18n } = useTranslation()

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
      } else if (object.version) {
        blogRef.current.showBlog(object.version)
      }
    }
    return selectedConfigIndex
  }

  useEffect(() => {
    if (chrome.runtime) {
      setLoading(true)
      StorageService.get(window.EXTENSION_ID, LOCAL_STORAGE_KEY.CONFIGS)
        .then(result => {
          const configurations = result.configs && result.configs.length > 0 ? result.configs : [{ ...defaultConfig }]
          setSelected(checkQueryParams(configurations))
          setConfigs(configurations)
        })
        .catch(setError)
        .finally(() => setLoading(false))
    }
  }, [])

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.CONFIGS]: configs }).catch(setError)
  }, [configs])

  const onChange = e => {
    const value = ElementUtil.getValue(e.currentTarget)
    window.dataLayer.push({ event: 'select', conversionName: 'configurations', section: 'configurations' })
    setSelected(value)
  }

  const addConfig = () => {
    const name = getConfigName(undefined, configs.length)
    setConfigs([{ ...defaultConfig, name }, ...configs])
    setSelected(0)
    toastRef.current.push({
      body: t('toast.configuration.add.body', { name })
    })
  }

  const exportAll = () => {
    download('All Configurations', configs)
  }

  const importAll = e => {
    const { files } = e.currentTarget
    if (files.length <= 0) {
      return false
    }
    const fr = new FileReader()
    fr.onload = function ({ target }) {
      try {
        const result = JSON.parse(target.result)
        if (Array.isArray(result)) {
          setConfigs(Format.configurations(result))
          setSelected(0)
        } else {
          toastRef.current.push({
            body: t('error.json')
          })
        }
      } catch (_error) {
        Logger.colorError(_error)
      }
    }
    fr.readAsText(files.item(0))
    return false
  }

  return (
    <div>
      {loading && <Loading />}
      {!i18n.language.includes('en') && (
        <div className='text-muted text-center my-3'>
          {t('common.translate')}{' '}
          <a href='https://github.com/Dhruv-Techapps/acf-i18n/discussions/4' target='_blank' rel='noopener noreferrer'>
            {t('common.clickHere')}
          </a>
        </div>
      )}
      <ErrorAlert error={error} />
      <div id='configs' className={`${scroll ? 'shadow bg-body-tertiary' : ' mb-4 mt-3'} sticky-top`}>
        <Container>
          <Row className={`rounded-pill ${!scroll && 'border'}`}>
            <Col>
              <Form>
                <Form.Group controlId='selected' className='mb-0'>
                  <Form.Select onChange={onChange} value={selected} id='configuration-list' className='ps-4 border-0' data-type='number'>
                    {configs.map((_config, index) => (
                      <option key={index} value={index} className={!_config.enable ? 'bg-secondary' : ''} style={{ '--bs-bg-opacity': `.25` }}>
                        ({_config.name || getConfigName(_config.url, index)}) {_config.url}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Col>
            <Col xs='auto' className='d-flex align-items-center'>
              <Button type='button' variant='outline-primary' onClick={addConfig} id='add-configuration' className='border-top-0 border-bottom-0 border'>
                {t('configuration.add')}
              </Button>
              <Dropdown id='configurations-dropdown-wrapper'>
                <Dropdown.Toggle as={DropdownToggle} id='configs-dropdown' ariaLabel='Configurations more option'>
                  <ThreeDots width='24' height='24' />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportAll}>{t('configuration.exportAll')}</Dropdown.Item>
                  <Dropdown.Item onClick={() => importFiled.current.click()}>{t('configuration.importAll')}</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className={configs.length === 1 ? '' : 'text-danger'}
                    disabled={configs.length === 1}
                    onClick={() => {
                      removeConfigsRef.current.showRemove()
                    }}>
                    {t('configuration.removeConfigs')}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => {
                      reorderConfigsRef.current.showReorder()
                    }}>
                    {t('configuration.reorder')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <div className='custom-file d-none'>
                <label className='custom-file-label' htmlFor='import-configurations' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
                  {t('configuration.importAll')}
                  <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-configurations' onChange={importAll} />
                </label>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <main>
        <Container>
          <Config configs={configs} configIndex={selected} confirmRef={confirmRef} setSelected={setSelected} toastRef={toastRef} setConfigs={setConfigs} configSettingsRef={configSettingsRef} />
          {mode === 'pro' && <Batch batch={config.batch} configEnable={config.enable} configIndex={selected} setConfigs={setConfigs} />}
          <Ads />
          <Action
            actions={config.actions}
            configEnable={config.enable}
            configIndex={selected}
            toastRef={toastRef}
            setConfigs={setConfigs}
            addonRef={addonRef}
            actionSettingsRef={actionSettingsRef}
            actionConditionRef={actionConditionRef}
          />
        </Container>
        <AddonModal ref={addonRef} configIndex={selected} setConfigs={setConfigs} />
        <ActionSettingsModal ref={actionSettingsRef} configIndex={selected} setConfigs={setConfigs} />
        <ActionConditionModal ref={actionConditionRef} configIndex={selected} setConfigs={setConfigs} />
        <ConfigSettingsModal ref={configSettingsRef} config={config} configIndex={selected} setConfigs={setConfigs} />
        <ReorderConfigsModal ref={reorderConfigsRef} />
        <RemoveConfigsModal ref={removeConfigsRef} />
        <Sponsors />
      </main>
    </div>
  )
}
Configs.propTypes = {
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired,
  blogRef: PropTypes.shape({ current: PropTypes.shape({ showBlog: PropTypes.func.isRequired }) }).isRequired,
  confirmRef: PropTypes.shape({ current: PropTypes.shape({ confirm: PropTypes.func.isRequired }) }).isRequired
}
export default Configs
