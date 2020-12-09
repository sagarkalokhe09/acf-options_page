import React from 'react'
import { Card, Row, Col, Form } from 'react-bootstrap'
import { ElementUtil } from '@dhruv-techapps/core-common'
import PropTypes from 'prop-types'
import BatchBody from './batch-body'
import { numberWithExponential } from '../../util/prop-types'

const Batch = ({ batch, configIndex, setConfigs }) => {
  const onChange = (e) => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget)
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        config.batch = { ...config.batch, [name]: value }
        return config
      }
      return config
    }))
  }

  return <Card className='mb-3'>
    <Card.Header as='h5'>
      <Row>
        <Col>
          <a target='_blank' rel='noopener noreferrer' href={process.env.REACT_APP_DOCS + 'batch'}>Batch</a>
        </Col>
        <Col md='auto'>
          <Form.Check
            type='switch'
            id='batch-refresh'
            label='Refresh'
            name='refresh'
            checked={batch.refresh}
            onChange={onChange}
          />
        </Col>
      </Row>
    </Card.Header>
    {!batch.refresh && <BatchBody batch={batch} configIndex={configIndex} setConfigs={setConfigs} />}
  </Card>
}

Batch.propTypes = {
  batch: PropTypes.shape({
    refresh: PropTypes.bool.isRequired,
    repeat: PropTypes.number,
    repeatInterval: numberWithExponential
  }),
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default React.memo(Batch)
