import React, { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { LOAD_TYPES, START_TYPES, defaultConfig } from '@dhruv-techapps/acf-common'
import { GTAG } from '../util'
import { HotkeyPopover } from '../popover'

const ConfigSettingsModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    reset,
    formState: { isDirty, isValid }
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultConfig,
    reValidateMode: 'onChange',
    shouldFocusError: true
  })
  const startType = watch('startType')
  const [show, setShow] = useState(false)

  const onSubmit = data => {
    const requestData = {}
    Object.keys(data).forEach(prop => {
      if (data[prop]) {
        requestData[prop] = data[prop]
      }
    })
    console.log('requestData', requestData)
    setConfigs(configs =>
      configs.map((config, index) => {
        if (index === configIndex) {
          return { ...config, ...requestData }
        }
        return config
      })
    )
    setShow(false)
    GTAG.event({ category: 'Config-Settings', Config: 'Click', label: 'Save' })
  }

  useImperativeHandle(ref, () => ({
    showSettings(config) {
      GTAG.modalview({ title: 'Config Settings', url: window.location.href, path: '/settings/config' })
      setShow(true)
      reset(config)
    }
  }))

  const handleClose = () => {
    setShow(false)
    GTAG.event({ category: 'Config-Settings', Config: 'Click', label: 'Close' })
  }

  const onKeyDown = e => {
    e.preventDefault()
    let value = ''
    if (e.ctrlKey) {
      value += 'Ctrl + '
    } else if (e.altKey) {
      value += 'Alt + '
    }
    if (e.shiftKey) {
      value += 'Shift + '
    }
    if (e.keyCode >= 65 && e.keyCode < 91) {
      value += String.fromCharCode(e.keyCode)
    }
    e.currentTarget.value = value
    return false
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Config Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className='mb-2'>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  Start&nbsp;
                  <Form.Check inline type='radio' name='startType' id='startAuto' value={START_TYPES.AUTO} ref={register} label='Auto' />
                  <Form.Check inline type='radio' name='startType' id='startManual' value={START_TYPES.MANUAL} ref={register} label='Manual' />
                  <small>
                    <ul className='mb-0 mt-2'>
                      <li>
                        <span className='text-primary'>Auto</span> (default) once browser is refresh or new page is loaded extension auto loads with it
                      </li>
                      <li>
                        <span className='text-primary'>Manual</span> once browser is loaded, user can manually invoke extension using hotkey
                      </li>
                    </ul>
                  </small>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={12} sm={12} hidden={startType === START_TYPES.AUTO}>
                  <Form.Group controlId='hotkey'>
                    <FormControl
                      placeholder={defaultConfig.hotkey}
                      aria-label={defaultConfig.hotkey}
                      name='hotkey'
                      aria-describedby='hotkey'
                      onKeyDown={onKeyDown}
                      ref={register({ pattern: /^(Ctrl \+ |Alt \+ |Shift \+ )+\D$/ })}
                      isInvalid={errors.hotkey}
                    />
                    <Form.Label>Hotkey</Form.Label>
                    <HotkeyPopover />
                    <Form.Control.Feedback type='invalid'>{errors.hotkey && 'Enter valid hotkey'}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={12} sm={12} hidden={startType === START_TYPES.MANUAL}>
                  Extension load&nbsp;
                  <Form.Check inline type='radio' name='loadType' id='loadTypeWindow' value={LOAD_TYPES.WINDOW} ref={register} label='Window' />
                  <Form.Check inline type='radio' name='loadType' id='loadTypeDocument' value={LOAD_TYPES.DOCUMENT} ref={register} label='Document' />
                  <small>
                    <ul className='mb-0 mt-2'>
                      <li>
                        <span className='text-primary'>Window</span> (default) browser loads extension once all its content is loaded
                      </li>
                      <li>
                        <span className='text-primary'>Document</span> browser loads extension before scripts and images are loaded (faster)(unsafe)
                      </li>
                    </ul>
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button type='submit' disabled={!isValid || !isDirty} variant='outline-primary'>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})

ConfigSettingsModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
const memo = React.memo(ConfigSettingsModal)
export { memo as ConfigSettingsModal }
