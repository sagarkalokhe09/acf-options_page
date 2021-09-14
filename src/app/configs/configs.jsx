import React, { createRef, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap'
import { Loading } from '@dhruv-techapps/core-components'
import { LOCAL_STORAGE_KEY, defaultAction, defaultConfig } from '@dhruv-techapps/acf-common'
import { ElementUtil, ExportService, Logger, StorageService } from '@dhruv-techapps/core-common'
import { useTranslation } from 'react-i18next'
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
      body: t('toast.configuration.add.body', { name }),
      header: t('toast.configuration.add.header'),
      toastClass: 'bg-success text-white'
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
      body: t('toast.configuration.remove.body', { name }),
      header: t('toast.configuration.remove.header'),
      toastClass: 'bg-danger text-white'
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Remove Confirmation' })
  }

  const removeConfigConfirm = () => {
    const name = configs[selected].name || configs[selected].url || `configuration-${selected}`
    confirmRef.current.confirm({
      title: t('confirm.configuration.remove.title'),
      message: t('confirm.configuration.remove.message', { name }),
      headerClass: 'text-danger',
      confirmFunc: removeConfig
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Remove' })
  }

  const exportAll = () => {
    ExportService.export('All Configurations', configs).catch(_error => {
      toastRef.current.push({
        body: JSON.stringify(_error),
        header: t('toast.configuration.exportAll.header'),
        toastClass: 'bg-danger text-white'
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
            body: t('error.json'),
            header: t('toast.configuration.importAll.header'),
            toastClass: 'bg-danger text-white'
          })
          GTAG.exception({ description: 'selected Json is not valid', fatal: false })
        }
        setLoading(false)
      } catch (_error) {
        Logger.error(_error)
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
          {i18n.language !== 'en' && (
            <Container fluid className='mt-2'>
              <Row>
                <Col>
                  <Alert variant='info'>
                    {t('common.translate')}{' '}
                    <a href='https://github.com/Dhruv-Techapps/acf-i18n/discussions/4' target='_blank' rel='noopener noreferrer'>
                      {t('common.clickHere')}
                    </a>
                  </Alert>
                </Col>
              </Row>
            </Container>
          )}
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
                    {t('configuration.add')}
                  </Button>
                  <Dropdown alignRight>
                    <Dropdown.Toggle as={DropdownToggle} id='configs-dropdown'>
                      <ThreeDots width='24' height='24' />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={exportAll}>{t('configuration.exportAll')}</Dropdown.Item>
                      <Dropdown.Item onClick={() => importFiled.current.click()}>{t('configuration.importAll')}</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={() => {
                          reorderConfigsRef.current.showReorder()
                        }}>
                        {t('configuration.reorder')}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={removeConfigConfirm} className={configs.length === 1 ? 'text-muted' : 'text-danger'} disabled={configs.length === 1}>
                        {t('configuration.remove')}
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
            <Container fluid>
              <Row>
                <Col xs={12}>{error && <ErrorAlert message={error} />}</Col>
                <Col xs={12} className='text-center'>
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
