import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Card, InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap'
import { defaultSettings, RETRY_OPTIONS, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { ReactComponent as VolumeUp } from 'bootstrap-icons/icons/volume-up.svg'
import { ReactComponent as VolumeMute } from 'bootstrap-icons/icons/volume-mute.svg'
import { StorageService } from '@dhruv-techapps/core-common'
import { Loading } from '@dhruv-techapps/core-components'
import { useForm } from 'react-hook-form'
import { REGEX_NUM } from '../util/regex'
import { convertNumberField } from '../util/validation'
import { ErrorAlert } from '../components/error.alert'
import GTAG from '../gtag'

const NUMBER_FIELDS = ['retry', 'retryInterval']

const SettingsModal = ({ show, handleClose }) => {
  const { register, handleSubmit, errors, reset, watch, formState: { isDirty, isValid } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: defaultSettings,
    shouldFocusError: true
  })
  const notificationSound = watch('notifications.sound')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [message, setMessage] = useState()

  useEffect(() => {
    StorageService.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSettings).then(reset).catch(setError).finally(_ => setLoading(false))
  }, [reset])

  const onSubmit = data => {
    convertNumberField(data, NUMBER_FIELDS)
    StorageService.setItem(LOCAL_STORAGE_KEY.SETTINGS, data).then(_ => {
      reset(data)
      setMessage('Settings saved successfully!')
      setTimeout(setMessage, 1500)
    }).catch(setError).finally(_ => setLoading(false))
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Save' })
  }

  return <Modal show={show} onHide={handleClose} size='lg'>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? <Loading className='d-flex justify-content-center m-5' />
          : <>
            {error && <ErrorAlert message={error}/>}
            <Card className='mb-2'>
              <Card.Body>
                <Row>
                  <Col md={12} sm={12}>
                    <Form.Check type="switch" id='checkiFrames' name='checkiFrames' ref={register} label='Check IFrames' />
                    <small className='text-muted'>This checks element within iFrames</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className='mb-2'>
              <Card.Header>Show Notification</Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <Form.Check type="switch" id='notifications.onError' name='notifications.onError' ref={register} label={<span>on <span className="text-danger">Error</span> occurred</span>}/>
                    <Form.Check type="switch" id='notifications.onAction' name='notifications.onAction' ref={register} label={<span>on <span className="text-success">Action</span> completion</span>} />
                    <Form.Check type="switch" id='notifications.onBatch' name='notifications.onBatch' ref={register} label={<span>on <span className="text-success">Batch</span> completion</span>} />
                    <Form.Check type="switch" id='notifications.onConfig' name='notifications.onConfig' ref={register} label={<span>on <span className="text-success">Config</span> completion</span>} />
                  </Col>
                  <Col className="d-flex align-items-center">
                    <Form.Check type="switch" id='notifications.sound' name='notifications.sound' ref={register} label={<span>Notification Sound {notificationSound ? <VolumeUp/> : <VolumeMute/>} </span>} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card className='mb-2'>
              <Card.Body>
                <small className='text-muted'>Extension load is moved under configure settings, you can set load type configure wise</small>
              </Card.Body>
            </Card>
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
                    <h6 className='my-2 text-secondary font-weight-light'><small>Below are action which can be performed if xpath is not found by extension after retry</small></h6>
                  </Col>
                  <Col md={4} sm={12}>
                    <Form.Check type='radio' name='retryOption' id='retryOptionStop' value={RETRY_OPTIONS.STOP} ref={register} label='Stop' />
                  </Col>
                  <Col md={4} sm={12}>
                    <Form.Check type='radio' name='retryOption' id='retryOptionSkip' value={RETRY_OPTIONS.SKIP} ref={register} label='Skip Not Found' />
                  </Col>
                  <Col md={4} sm={12}>
                    <Form.Check type='radio' name='retryOption' id='retryOptionReload' value={RETRY_OPTIONS.RELOAD} ref={register} label='Refresh' />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={12}>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='push-notification-key'>Push Notification Key</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder='' aria-label='' id='pushNotificationKey' name='pushNotificationKey' aria-describedby='push-notification-key'
                        ref={register}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </>}
      </Modal.Body>
      <Modal.Footer>
        <span className='text-success'>{message}</span>
        <Button type='submit' className="ml-2" disabled={!isValid || !isDirty || error}>Save</Button>
      </Modal.Footer>
    </Form>
  </Modal>
}

SettingsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}
export default SettingsModal
