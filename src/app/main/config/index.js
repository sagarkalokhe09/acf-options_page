import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import './config.scss'
import Batch from '../batch'
import Action from '../action'

import { Card, Form, Row, Col, Dropdown, Badge } from 'react-bootstrap'
import { ReactComponent as ThreeDots } from 'bootstrap-icons/icons/three-dots.svg'
import { DropdownToggle } from '../../components/DropdownToggle'
import { ExportService, ImportService, ElementUtil } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import ConfigBody from './config-body'
import { numberWithExponential } from '../../util/prop-types'
import GTAG from '../../gtag'
import Format from '../../data/format'

const Config = ({ config, configIndex, toastRef, setConfigs, configSettingsRef }) => {
  const importFiled = createRef()
  const onChange = (e) => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget)
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        return { ...configs[configIndex], [name]: value }
      }
      return config
    }))
    GTAG.event({ category: 'Action', action: 'Change', label: name, value })
  }

  const exportConfig = () => {
    let url = config.url.split('/')
    url = url[2] || 'default'
    ExportService.export(config.name || url || `configuration-${configIndex}`, config).catch(error => {
      toastRef.current.push({
        body: JSON.stringify(error),
        header: <strong className='mr-auto'>Export Error</strong>,
        bodyClass: 'text-danger'
      })
    })
    GTAG.event({ category: 'Action', action: 'Click', label: 'Export' })
  }

  const importConfig = (e) => {
    var files = e.currentTarget.files
    if (files.length <= 0) {
      return false
    }
    var fr = new FileReader()
    fr.onload = function (e) {
      try {
        const _config = JSON.parse(e.target.result)
        if (Array.isArray(_config)) {
          toastRef.current.push({
            body: 'selected Json is not valid',
            header: <strong className='mr-auto'>Import Error</strong>,
            bodyClass: 'text-danger'
          })
          GTAG.exception({ description: 'selected Json is not valid', fatal: false })
        } else {
          const _name = _config.name || _config.url || 'configuration'
          ImportService.import(Format.configuration(_config), LOCAL_STORAGE_KEY.CONFIGS)
          toastRef.current.push({
            body: <p><span className="badge badge-success">{_name}</span> imported successfully!</p>,
            header: <strong className='mr-auto'>Configuration</strong>,
            delay: 2000,
            onClose: () => { window.location.reload() }
          })
          GTAG.event({ category: 'Action', action: 'Click', label: 'Import' })
        }
      } catch (error) {
        toastRef.current.push({
          body: JSON.stringify(error),
          header: <strong className='mr-auto'>Import Error</strong>,
          bodyClass: 'text-danger'
        })
        console.error(error)
        GTAG.exception({ description: error, fatal: true })
      }
    }
    fr.readAsText(files.item(0))
  }

  const showSettings = () => {
    GTAG.event({ category: 'Config', action: 'Click', label: 'Show Settings' })
    configSettingsRef.current.showSettings(config)
  }

  return <Card className='mb-3'>
    <Card.Header as='h5'>
      <Row>
        <Col className='d-flex align-items-center'>
          Configuration {!config.enable && <Badge pill variant="danger font-weight-light" >Disabled</Badge>}
        </Col>
        <Col md='auto' className='d-flex align-items-center'>
          <Form.Check type='switch' name='enable' id='config-enable' label='Enable' checked={config.enable} onChange={onChange} />
          <Dropdown className='ml-3' alignRight>
            <Dropdown.Toggle as={DropdownToggle} id="config-dropdown">
              <ThreeDots width='24' height='24' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={exportConfig}>Export</Dropdown.Item>
              <Dropdown.Item onClick={_ => importFiled.current.click()}>Import</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={showSettings}>Settings</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="custom-file d-none">
            <input type="file" className="custom-file-input" ref={importFiled} accept=".json" id="import-configuration" onChange={importConfig} />
            <label className="custom-file-label" htmlFor="import-configuration" style={{ fontSize: 1 + 'rem', fontWeight: 400 }}>Import</label>
          </div>
        </Col>
      </Row>
    </Card.Header>
    <ConfigBody config={config} configIndex={configIndex} setConfigs={setConfigs} />
  </Card>
}

Config.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  toastRef: Action.type.propTypes.toastRef,
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
