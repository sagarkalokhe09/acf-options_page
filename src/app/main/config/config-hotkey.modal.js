import React, { forwardRef, useImperativeHandle, useState } from 'react'

import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Alert, Card, InputGroup, FormControl } from 'react-bootstrap'
import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { useForm } from 'react-hook-form'
import { REGEX_NUM } from '../../util/regex'
import GTAG from '../../gtag'

const ConfigHotkeyModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { register, handleSubmit, errors, reset, formState: { isDirty, isValid } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true
  })
  const [show, setShow] = useState(false)

  const onSubmit = data => {
    reset(data)
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        config.hotkey = data
        return { ...config }
      }
      return config
    }))
    setShow(false)
    GTAG.event({ category: 'Configuration Hotkey', action: 'Click', label: 'Save' })
  }

  const onReset = () => {
    reset({})
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        delete config.hotkey
        return { ...config }
      }
      return config
    }))
    GTAG.event({ category: 'Configuration Hotkey', action: 'Click', label: 'Reset' })
  }

  useImperativeHandle(ref, () => ({
    showHotkey (hotkey) {
      GTAG.modalview({ title: 'Configuration Hotkey', url: window.location.href, path: '/configuration/hotkey' })
      reset(hotkey)
      setShow(true)
    }
  }))

  const handleClose = () => {
    setShow(false)
    GTAG.event({ category: 'Configuration Hotkey', action: 'Click', label: 'Close' })
  }

  return <Modal show={true} size='sm' onHide={handleClose}>
    <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
      <Modal.Header closeButton>
        <Modal.Title>Hotkey</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">Configuration Hotkey will start extension manually</Alert>
        <Card className='mb-2'>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group controlId='hotkey-prefix' className='mb-0'>
                  <Form.Control as='select' custom>
                    <option value="ctrl">Ctrl</option>
                    <option value="alt">Alt</option>
                    <option value="ctrl + shift">Ctrl + Shift</option>
                    <option value="alt + shift">Alt + Shift</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <InputGroup>
                  <FormControl
                    placeholder='R' aria-label='R' id='hotkey-suffix' name='hotkey-suffix' aria-describedby='hotkey-suffix'
                    ref={register({ pattern: /\w/ })}
                    isInvalid={errors.hotkeySuffix}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.hotkeySuffix && 'Only valid Alphabet is allowed'}</Form.Control.Feedback>
                </InputGroup>
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

ConfigHotkeyModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default React.memo(ConfigHotkeyModal)
