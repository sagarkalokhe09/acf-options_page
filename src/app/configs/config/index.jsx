import React, { createRef } from 'react'
import PropTypes from 'prop-types'

import { ElementUtil, ExportService, ImportService, Logger } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { useTranslation } from 'react-i18next'
import { Badge, Card, Col, Dropdown, Form, Row } from 'react-bootstrap'
import ConfigBody from './config-body'
import Action from '../action'
import Batch from '../batch'
import { Format, GTAG, ThreeDots, numberWithExponential } from '../../../util'
import { DropdownToggle } from '../../../components'

const Config = ({ config, configIndex, toastRef, setConfigs, configSettingsRef }) => {
  const { t } = useTranslation()
  const importFiled = createRef()
  const onChange = e => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget)
    setConfigs(prevConfigs =>
      prevConfigs.map((prevConfig, index) => {
        if (index === configIndex) {
          return { ...prevConfigs[configIndex], [name]: value }
        }
        return prevConfig
      })
    )
    GTAG.event({ category: 'Action', action: 'Change', label: name, value })
  }

  const exportConfig = () => {
    let url = config.url.split('/')
    url = url[2] || 'default'
    ExportService.export(config.name || url || `configuration-${configIndex}`, config).catch(error => {
      toastRef.current.push({
        body: JSON.stringify(error),
        header: <strong className='mr-auto'>Export Error</strong>,
        toastClass: 'bg-danger text-white'
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
            body: t('error.json'),
            header: t('toast.configuration.importError.header'),
            toastClass: 'bg-danger text-white'
          })
          GTAG.exception({ description: 'selected Json is not valid', fatal: false })
        } else {
          ImportService.import(Format.configuration(importedConfig), LOCAL_STORAGE_KEY.CONFIGS)
          toastRef.current.push({
            body: t('toast.configuration.importSuccess.body', { name: importedConfig.name || importedConfig.url || 'configuration' }),
            header: t('toast.configuration.importSuccess.header'),
            toastClass: 'bg-success text-white',
            delay: 2000,
            onClose: () => {
              window.location.reload()
            }
          })
          GTAG.event({ category: 'Action', action: 'Click', label: 'Import' })
        }
      } catch (error) {
        toastRef.current.push({
          body: JSON.stringify(error),
          header: t('toast.configuration.importError.header'),
          toastClass: 'bg-danger text-white'
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

  return (
    <Card className='mb-4'>
      <Card.Header as='h2'>
        <Row>
          <Col className='d-flex align-items-center'>
            <small>{t('configuration.title')}</small>
            {!config.enable && (
              <Badge pill variant='danger ml-2'>
                {t('common.disabled')}
              </Badge>
            )}
          </Col>
          <Col md='auto' className='d-flex align-items-center'>
            <Form.Check type='switch' name='enable' id='config-enable' label={t('configuration.enable')} checked={config.enable} onChange={onChange} />
            <Dropdown className='ml-3' alignRight>
              <Dropdown.Toggle as={DropdownToggle} id='config-dropdown'>
                <ThreeDots width='24' height='24' />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={exportConfig}>{t('configuration.export')}</Dropdown.Item>
                <Dropdown.Item onClick={() => importFiled.current.click()}>{t('configuration.import')}</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={showSettings}>{t('configuration.settings')}</Dropdown.Item>
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
      <ConfigBody config={config} configIndex={configIndex} setConfigs={setConfigs} />
    </Card>
  )
}

Config.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired,
  configSettingsRef: PropTypes.shape({ current: PropTypes.shape({ showSettings: PropTypes.func.isRequired }) }).isRequired,
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
