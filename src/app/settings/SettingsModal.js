import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Card, InputGroup, FormControl, Row, Col, Button, Alert } from 'react-bootstrap'
import { defaultSetting, LOAD_TYPES, RETRY_OPTIONS, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { StorageService } from '@dhruv-techapps/core-common'
import { Loading } from '@dhruv-techapps/core-components'
import { useForm } from 'react-hook-form'
import { REGEX_NUM, REGEX_SEC } from '../util/regex'

const NUMBER_FIELDS = ['retry', 'retryInterval']

const SettingsModal = ({ show, handleClose }) => {
  const { register, handleSubmit, errors, reset, formState: { isDirty, isValid } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: defaultSetting,
    shouldFocusError: true
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    StorageService.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSetting).then(_settings => {
      reset(_settings)
    }).catch(setError).finally(_ => setLoading(false))
  }, [reset])

  const onSubmit = data => {
    for (const field in data) {
      if (NUMBER_FIELDS.indexOf(field) !== -1) {
        data[field] = Number(data[field])
      }
    }
    StorageService.setItem(LOCAL_STORAGE_KEY.SETTINGS, data).then(_ => {
      reset(data)
    }).catch(setError).finally(_ => setLoading(false))
  }

  return <Modal show={show} onHide={handleClose} size='lg'>
    <Modal.Header closeButton>
      <Modal.Title>Settings</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {loading ? <Loading className='d-flex justify-content-center m-5' />
        : error ? <Alert variant='danger'><Alert.Heading>Error</Alert.Heading>{JSON.stringify(error)}</Alert> : <>
          <Card className='mb-2'>
            <Card.Body>
              <Card.Subtitle>
                <Form.Check id='checkiFrames' name='checkiFrames' ref={register} label='Check IFrames' />
              </Card.Subtitle>
              <Card.Text className='text-muted'>
                <small>Check this box if you want to check xPath within iFrames also</small>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className='mb-2'>
            <Card.Body>
              <Card.Subtitle>
                <Form.Check id='notifications' name='notifications' ref={register} label='Show Notification' />
              </Card.Subtitle>
              <Card.Text className='text-muted'>
                <small>This is very important feature of extension which tells you if any error occur in extension while executing or if any XPath provided is not found or wrong. Select this option while configuring and uncheck once you have finished configuring.</small>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className='mb-2'>
            <Card.Body>
              <Card.Subtitle>
                Extension load <Form.Check inline type='radio' name='loadType' id='loadTypeWindow' value={LOAD_TYPES.WINDOW} ref={register} label='Window' />
                <Form.Check inline type='radio' name='loadType' id='loadTypeDocument' value={LOAD_TYPES.DOCUMENT} ref={register} label='Document' />
              </Card.Subtitle>
              <small>
                <ul className='mb-0 mt-2'>
                  <li><span className='text-primary'>Window</span> (default) browser loads extension once all its content is loaded</li>
                  <li><span className='text-primary'>Document</span> browser loads extension before scripts and images are loaded (faster)(unsafe)</li>
                </ul>
              </small>
            </Card.Body>
          </Card>
          <Card className='mb-2'>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
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
                        ref={register({ pattern: REGEX_SEC })}
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
                {isDirty && <div className='d-flex justify-content-end mt-2'>
                  <Button type='submit' disabled={!isValid}>Save</Button>
                </div>}
              </Form>
            </Card.Body>
          </Card>
        </>}
    </Modal.Body>
  </Modal>
}

SettingsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}
export default SettingsModal
