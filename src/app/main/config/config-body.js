import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { REGEX_SEC, REGEX_START_TIME } from '../../util/regex'
const NUMBER_FIELDS = ['initWait']
const ConfigBody = ({ config, configIndex, setConfigs }) => {
  console.log('ConfigBody')
  const { register, handleSubmit, errors, reset, formState: { isDirty } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: config,
    shouldFocusError: true
  })

  const onSubmit = data => {
    for (const field in data) {
      if (NUMBER_FIELDS.indexOf(field) !== -1) {
        data[field] = Number(data[field])
      }
    }
    reset(data)
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        return { ...config, ...data }
      }
      return config
    }))
  }

  return <Form onSubmit={handleSubmit(onSubmit)}>
    <Card.Body>
      <Row>
        <Col md='5' sm='12'>
          <InputGroup className='mb-2'>
            <InputGroup.Prepend>
              <InputGroup.Text id='config-name'>Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl name='name' ref={register} placeholder='getautoclicker.com' aria-label='getautoclicker.com' aria-describedby='config-name' />
          </InputGroup>
        </Col>
        <Col md='7' sm='12'>
          <InputGroup className='mb-2'>
            <InputGroup.Prepend>
              <InputGroup.Text id='config-url'>URL&nbsp;<small className='text-danger'>*</small></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              name='url' ref={register({ required: true })}
              isInvalid={!!errors.url}
              placeholder='https://getautoclicker.com/' aria-label='https://getautoclicker.com/' aria-describedby='config-url'
            />
            <Form.Control.Feedback type='invalid'>{errors.url && 'URL is required'}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col md='5' sm='12'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id='config-init-wait'>Init Wait&nbsp;<small className='text-info'>(sec)</small></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              ref={register({ pattern: REGEX_SEC })}
              isInvalid={!!errors.initWait} name='initWait' placeholder='0' aria-label='0' aria-describedby='config-init-wait'
            />
            <Form.Control.Feedback type='invalid'>{errors.initWait && 'Only valid numbers are allowed'}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col md='7' sm='12'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id='config-start-time'>Start Time&nbsp;<small className='text-info'>(24 hrs)</small></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              ref={register({ pattern: REGEX_START_TIME })}
              isInvalid={!!errors.startTime}
              name='startTime' placeholder='hh:mm:ss' aria-label='hh:mm:ss' aria-describedby='config-start-time'
            />
            <Form.Control.Feedback type='invalid'>{errors.startTime && 'Start time should matcg hh:mm:ss format'}</Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Row>
      {isDirty && <div className='d-flex justify-content-end mt-2'>
        <Button type='submit'>Save</Button>
      </div>}
    </Card.Body>
  </Form>
}
ConfigBody.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  config: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,
    initWait: PropTypes.number,
    startTime: PropTypes.string
  }).isRequired
}
export default ConfigBody
