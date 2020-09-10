import React from 'react'
import { Card, Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap'
import { ElementUtil } from '@dhruv-techapps/core-common'
import PropTypes from 'prop-types'

const Batch = ({ batch, selected, setConfigs }) => {
  const onChange = (e) => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget)
    setConfigs(configs => configs.map((config, index) => {
      if (index === selected) {
        return { ...configs[selected], batch: { ...configs[selected].batch, [name]: value } }
      }
      return config
    }))
  }

  return <Card className='mb-3'>
    <Card.Header as='h5'>
      <Row>
        <Col>
          <a target='_blank' rel='noopener noreferrer' href='https://getautoclicker.com/docs/batch'>Batch</a>
        </Col>
        <Col md='auto'>
          <Form>
            <Form.Check
              type='switch'
              id='batch-refresh'
              label='Refresh'
              name='refresh'
              checked={batch.refresh}
              onChange={onChange}
            />
          </Form>
        </Col>
      </Row>
    </Card.Header>
    {!batch.refresh && <Card.Body>
      <Row>
        <Col md='6' sm='12'>
          <InputGroup className='mb-3'>
            <InputGroup.Prepend>
              <InputGroup.Text id='batch-repeat'>repeat</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder='0'
              aria-label='0'
              name='repeat'
              value={batch.repeat || ''}
              data-type='number'
              onChange={onChange}
              aria-describedby='batch-repeat'
            />
          </InputGroup>
        </Col>
        <Col md='6' sm='12'>
          <InputGroup className='mb-3'>
            <InputGroup.Prepend>
              <InputGroup.Text id='batch-repeat-interval'>R-Interval</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder='0'
              aria-label='0'
              onChange={onChange}
              data-type='number'
              value={batch.repeatInterval || ''}
              name='repeatInterval'
              aria-describedby='batch-repeat-interval'
            />
            <InputGroup.Append>
              <InputGroup.Text id='batch-repeat-interval'>sec</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
    </Card.Body>}
  </Card>
}

Batch.propTypes = {
  batch: PropTypes.shape({
    refresh: PropTypes.bool.isRequired,
    repeat: PropTypes.number,
    repeatInterval: PropTypes.number
  }),
  selected: PropTypes.bool.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default Batch
