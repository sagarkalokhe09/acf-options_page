import React, { createRef, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Logger } from '@dhruv-techapps/core-common'
import { ExportService, ImportService } from '@dhruv-techapps/core-services'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { useTranslation } from 'react-i18next'
import { Badge, Card, Col, Dropdown, Form, Row } from 'react-bootstrap'
import ConfigBody from './config-body'
import Action from '../action'
import Batch from '../batch'
import { Format, GTAG, ThreeDots, numberWithExponential } from '../../../util'
import { DropdownToggle } from '../../../components'
import { ThemeContext } from '../../../_providers/ThemeProvider'
import { getElementProps } from '../../../util/element'

const Config = ({ config, configIndex, toastRef, setConfigs, configSettingsRef, confirmRef, configsLength, setSelected }) => {
  const { theme } = useContext(ThemeContext)
  const { t } = useTranslation()
  const importFiled = createRef()
  const [message, setMessage] = useState()

  const onUpdate = e => {
    const update = getElementProps(e)
    if (update) {
      setConfigs(prevConfigs =>
        prevConfigs.map((prevConfig, index) => {
          if (index === configIndex) {
            return { ...prevConfig, ...update }
          }
          return prevConfig
        })
      )
      setMessage(t('configuration.saveMessage'))
      setTimeout(setMessage, 1500)
    }
  }

  const exportConfig = () => {
    let url = config.url.split('/')
    url = url[2] || 'default'
    ExportService.export(config.name || url || `configuration-${configIndex}`, config).catch(error => {
      toastRef.current.push({
        body: JSON.stringify(error)
      })
    })
    GTAG.event({ category: 'Action', action: 'Click', label: 'Export' })
  }

  const importConfig = ({ currentTarget: { files } }) => {
    if (files.length <= 0) {
      return false
    }
    const fr = new FileReader()
    fr.onload = function ({ target }) {
      try {
        const importedConfig = JSON.parse(target.result)
        if (Array.isArray(importedConfig)) {
          toastRef.current.push({
            body: t('error.json')
          })
          GTAG.exception({ description: 'selected Json is not valid', fatal: false })
        } else {
          ImportService.import(Format.configuration(importedConfig), LOCAL_STORAGE_KEY.CONFIGS)
          toastRef.current.push({
            body: t('toast.configuration.importSuccess.body', { name: importedConfig.name || importedConfig.url || 'configuration' }),
            delay: 2000,
            onClose: () => {
              window.location.reload()
            }
          })
          GTAG.event({ category: 'Action', action: 'Click', label: 'Import' })
        }
      } catch (error) {
        toastRef.current.push({
          body: JSON.stringify(error)
        })
        Logger.error(error)
        GTAG.exception({ description: error, fatal: true })
      }
    }
    fr.readAsText(files.item(0))
    return false
  }

  const showSettings = () => {
    GTAG.event({ category: 'Config', action: 'Click', label: 'Show Settings' })
    configSettingsRef.current.showSettings(config)
  }

  const removeConfig = () => {
    const { name } = config
    // setLoading(true)
    setConfigs(configs => configs.filter((_, index) => index !== configIndex))
    setSelected(prevSelected => {
      if (configsLength === 2) {
        return 0
      }
      return prevSelected === 0 ? prevSelected : prevSelected - 1
    })
    // setLoading(false)
    toastRef.current.push({
      body: t('toast.configuration.remove.body', { name })
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Remove Confirmation' })
  }

  const removeConfigConfirm = () => {
    const name = config.name || config.url || `configuration-${configIndex}`
    confirmRef.current.confirm({
      title: t('confirm.configuration.remove.title'),
      message: t('confirm.configuration.remove.message', { name }),
      headerClass: 'text-danger',
      confirmFunc: removeConfig
    })
    GTAG.event({ category: 'Configuration', action: 'Click', label: 'Remove' })
  }

  return (
    <Card className='mb-4' bg={theme} text={theme === 'dark' && 'white'}>
      <Card.Header as='h6'>
        <Row>
          <Col className='d-flex align-items-center'>
            {t('configuration.title')}
            <div className='d-flex align-items-center'>
              {!config.enable && (
                <Badge pill bg='secondary' className='ms-2 d-none d-md-block'>
                  {t('common.disabled')}
                </Badge>
              )}
            </div>
            <small className='text-success ms-3'>{message}</small>
          </Col>
          <Col xs='auto' className='d-flex align-items-center'>
            <Form>
              <Form.Check type='switch' className='m-0' name='enable' id='config-enable' label={t('configuration.enable')} checked={config.enable} onChange={onUpdate} />
            </Form>
            <Dropdown>
              <Dropdown.Toggle as={DropdownToggle} id='config-dropdown' className='py-0 pe-0'>
                <ThreeDots width='24' height='24' />
              </Dropdown.Toggle>
              <Dropdown.Menu variant={theme}>
                <Dropdown.Item onClick={exportConfig}>{t('configuration.export')}</Dropdown.Item>
                <Dropdown.Item onClick={() => importFiled.current.click()}>{t('configuration.import')}</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={showSettings}>{t('configuration.settings')}</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={removeConfigConfirm} className={configsLength === 1 ? '' : 'text-danger'} disabled={configsLength === 1}>
                  {t('configuration.remove')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className='custom-file d-none'>
              <label className='custom-file-label' htmlFor='import-configuration' style={{ fontSize: `${1}rem`, fontWeight: 400 }}>
                {t('configuration.import')}
                <input type='file' className='custom-file-input' ref={importFiled} accept='.json' id='import-configuration' onChange={importConfig} />
              </label>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <ConfigBody config={config} configIndex={configIndex} setConfigs={setConfigs} onUpdate={onUpdate} />
    </Card>
  )
}

Config.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  configsLength: PropTypes.number.isRequired,
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired,
  configSettingsRef: PropTypes.shape({ current: PropTypes.shape({ showSettings: PropTypes.func.isRequired }) }).isRequired,
  confirmRef: PropTypes.shape({ current: PropTypes.shape({ confirm: PropTypes.func.isRequired }) }).isRequired,
  config: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,
    initWait: numberWithExponential,
    startTime: PropTypes.string,
    batch: Batch.type.propTypes.batch,
    actions: Action.type.propTypes.actions,
    startManually: PropTypes.bool
  }).isRequired
}
export default React.memo(Config)
