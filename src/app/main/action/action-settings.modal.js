import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Alert, Card, InputGroup, FormControl } from 'react-bootstrap'
import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { useForm } from 'react-hook-form'
import { REGEX_NUM } from '../../util/regex'
import { convertNumberField } from '../../util/validation'

const NUMBER_FIELDS = ['retry', 'retryInterval']

const ActionSettingsModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { register, handleSubmit, errors, reset, formState: { isDirty, isValid } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true
  })
  const [show, setShow] = useState(false)
  const actionIndex = useRef(-1)

  const onSubmit = data => {
    const requestData = {}
    for (const prop in data) {
      if (data[prop]) {
        requestData[prop] = data[prop]
      }
    }
    convertNumberField(requestData, NUMBER_FIELDS)
    reset(data)
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        if (!config.actions[actionIndex.current]) {
          config.actions[actionIndex.current] = {}
        }
        config.actions[actionIndex.current].settings = { ...requestData }
        return { ...config }
      }
      return config
    }))
    setShow(false)
  }

  const onReset = () => {
    reset({})
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex && config.actions[actionIndex.current]) {
        delete config.actions[actionIndex.current].settings
        return { ...config }
      }
      return config
    }))
  }

  useImperativeHandle(ref, () => ({
    showSettings (index, settings) {
      actionIndex.current = index
      reset({ ...settings })
      setShow(true)
    }
  }))

  const handleClose = () => { setShow(false) }

  return <Modal show={show} size='lg' onHide={handleClose}>
    <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
      <Modal.Header closeButton>
        <Modal.Title>Action Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">Action settings will override global settings</Alert>
        <Card className='mb-2'>
          <Card.Body>
            <Row>
              <Col md={6} sm={12} className='mb-2 mb-md-0'>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='retry'>Retry</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder='5' aria-label='5' id='retry' name='retry' aria-describedby='retry'
                    ref={register({ pattern: REGEX_NUM })}
                    isInvalid={errors.retry}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.retry && 'Only valid numbers are allowed'}</Form.Control.Feedback>
                </InputGroup>
              </Col>
              <Col md={6} sm={12}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='retry-interval'>Retry Interval&nbsp;<small className='text-info'>(sec)</small></InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder='1' aria-label='1' id='retryInterval' name='retryInterval' aria-describedby='retry-interval'
                    ref={register({ validate: value => !isNaN(value) })}
                    isInvalid={errors.retryInterval}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.retryInterval && 'Only valid numbers are allowed'}</Form.Control.Feedback>
                </InputGroup>
              </Col>
              <Col xs={12}>
                <h6 className='my-2 text-secondary font-weight-light'><small>* Below are action which can be performed if xpath is not found by extension after retry</small></h6>
              </Col>
              <Col md={4} sm={12}>
                <Form.Check type='radio' name='retryOption' id='retryOptionStop' value={RETRY_OPTIONS.STOP} ref={register} label='Stop' />
              </Col>
              <Col md={4} sm={12}>
                <Form.Check type='radio' name='retryOption' id='retryOptionSkip' value={RETRY_OPTIONS.SKIP} ref={register} label='Skip Not Found' />
              </Col>
              <Col md={4} sm={12}>
                <Form.Check type='radio' name='retryOption' id='retryOptionReload' value={RETRY_OPTIONS.RELOAD} ref={register} label='Retry Refresh' />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button type='reset' variant="danger">Clear</Button>
        <Button type='submit' disabled={!isValid || !isDirty} className="ml-3">Save</Button>
      </Modal.Footer>
    </Form>
  </Modal>
})

ActionSettingsModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default React.memo(ActionSettingsModal)
