import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Col, Form, FormControl, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { GTAG, REGEX_START_TIME, convertNumberField, numberWithExponential } from '../../../util'
import { StartTimePopover } from '../../../popover'

const NUMBER_FIELDS = ['initWait']
const ConfigBody = ({ config, configIndex, setConfigs }) => {
  const didMountRef = useRef(true)
  const {
    register,
    handleSubmit,
    errors,
    reset,
    formState: { isDirty, isValid }
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: config,
    shouldFocusError: true
  })

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    reset(config)
  }, [config, reset])

  const onSubmit = data => {
    convertNumberField(data, NUMBER_FIELDS)
    reset(data)
    setConfigs(prevConfigs =>
      prevConfigs.map((prevConfig, index) => {
        if (index === configIndex) {
          return { ...prevConfig, ...data }
        }
        return prevConfig
      })
    )
    GTAG.event({ category: 'Action', action: 'Click', label: 'Save' })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card.Body>
        <Row>
          <Col md='12' sm='12'>
            <Form.Group controlId='config-url'>
              <FormControl name='url' ref={register({ required: true })} isInvalid={!!errors.url} placeholder={process.env.BASE} aria-label={process.env.BASE} aria-describedby='config-url' />
              <Form.Label>
                URL&nbsp;<small className='text-danger'>*</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{errors.url && 'URL is required'}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='4' sm='12'>
            <Form.Group controlId='config-name'>
              <FormControl name='name' ref={register} placeholder='getautoclicker.com' aria-label='getautoclicker.com' aria-describedby='config-name' />
              <Form.Label>Name</Form.Label>
            </Form.Group>
          </Col>
          <Col md='4' sm='12'>
            <Form.Group controlId='config-init-wait'>
              <FormControl
                ref={register({ validate: value => !Number.isNaN(value) })}
                isInvalid={!!errors.initWait}
                name='initWait'
                list='interval'
                placeholder='0'
                aria-label='0'
                aria-describedby='config-init-wait'
              />
              <Form.Label>
                Init Wait&nbsp;<small className='text-info'>(sec)</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{errors.initWait && 'Only valid numbers are allowed'}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='4' sm='12'>
            <Form.Group controlId='config-start-time'>
              <FormControl
                ref={register({ pattern: REGEX_START_TIME })}
                isInvalid={!!errors.startTime}
                name='startTime'
                placeholder='HH:mm:ss:fff'
                aria-label='HH:mm:ss:fff'
                list='start-time'
                aria-describedby='config-start-time'
              />
              <Form.Label>Start Time&nbsp;</Form.Label>
              <StartTimePopover />
              <Form.Control.Feedback type='invalid'>{errors.startTime && 'Start time should match HH:mm:ss:fff (12:12:12:000) format'}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        {isDirty && (
          <div className='d-flex justify-content-end mt-2'>
            <Button type='submit' variant='outline-primary' disabled={!isValid}>
              Save
            </Button>
          </div>
        )}
      </Card.Body>
    </Form>
  )
}
ConfigBody.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  config: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,
    initWait: numberWithExponential,
    startTime: PropTypes.string
  }).isRequired
}
export default ConfigBody
