import React from 'react'
import PropTypes from 'prop-types'
import './config.scss'
import Batch from './batch'
import Action from './action'

import { Card, Form, Row, Col, Dropdown } from 'react-bootstrap'
import { ReactComponent as ThreeDotsVertical } from 'bootstrap-icons/icons/three-dots-vertical.svg'
import { DropdownToggle } from '../components/dropdown'
import { ElementUtil } from '@dhruv-techapps/core-common'
import ConfigBody from './config/config-body'
const Config = ({ config, configIndex, setConfigs }) => {
  console.log('Config')

  const onChange = (e) => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget)
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        return { ...configs[configIndex], [name]: value }
      }
      return config
    }))
  }

  const exportConfig = () => {
    console.log('export')
  }

  const importConfig = () => {
    console.log('import')
  }

  return <Card className='mb-3'>
    <Card.Header as='h5'>
      <Row>
        <Col className='d-flex align-items-center'>
          <a target='_blank' rel='noopener noreferrer' href='https://getautoclicker.com/docs/configuration'>Configuration</a>
        </Col>
        <Col md='auto' className='d-flex align-items-center'>
          <Form.Check type='switch' name='enable' id='config-enable' label='Enable' checked={config.enable} onChange={onChange} />
          <Dropdown className='ml-3' alignRight>
            <Dropdown.Toggle as={DropdownToggle}>
              <ThreeDotsVertical width='24' height='24' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href='#/action-1' onClick={exportConfig}>Export</Dropdown.Item>
              <Dropdown.Item href='#/action-2' onClick={importConfig}>Import</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Card.Header>
    {config.enable && <ConfigBody config={config} configIndex={configIndex} setConfigs={setConfigs} />}
  </Card>
}

Config.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  config: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,
    initWait: PropTypes.number,
    startTime: PropTypes.string,
    batch: Batch.type.propTypes.batch,
    actions: Action.type.propTypes.actions
  }).isRequired
}
export default React.memo(Config)
