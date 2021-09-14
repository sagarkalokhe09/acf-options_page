import React, { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { LOAD_TYPES, START_TYPES, defaultConfig } from '@dhruv-techapps/acf-common'
import { Trans, useTranslation } from 'react-i18next'
import { GTAG } from '../util'
import { HotkeyPopover } from '../popover'

const ConfigSettingsModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { t } = useTranslation()
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
          <Modal.Title>{t('modal.configSettings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className='mb-2'>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  {t('modal.configSettings.start')}&nbsp;
                  <Form.Check inline type='radio' name='startType' id='startAuto' value={START_TYPES.AUTO} ref={register} label={t('modal.configSettings.auto')} />
                  <Form.Check inline type='radio' name='startType' id='startManual' value={START_TYPES.MANUAL} ref={register} label={t('modal.configSettings.manual')} />
                  <small>
                    <ul className='mb-0 mt-2'>
                      <li>
                        <Trans i18nKey='modal.configSettings.autoHint' components={{ b: <b /> }} />
                      </li>
                      <li>
                        <Trans i18nKey='modal.configSettings.manualHint' components={{ b: <b /> }} />
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
                    <Form.Label>{t('modal.configSettings.hotkey')}</Form.Label>
                    <HotkeyPopover />
                    <Form.Control.Feedback type='invalid'>{errors.hotkey && t('error.hotkey')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={12} sm={12} hidden={startType === START_TYPES.MANUAL}>
                  {t('modal.configSettings.extensionLoad')}&nbsp;
                  <Form.Check inline type='radio' name='loadType' id='loadTypeWindow' value={LOAD_TYPES.WINDOW} ref={register} label={t('modal.configSettings.window')} />
                  <Form.Check inline type='radio' name='loadType' id='loadTypeDocument' value={LOAD_TYPES.DOCUMENT} ref={register} label={t('modal.configSettings.document')} />
                  <small>
                    <ul className='mb-0 mt-2'>
                      <li>
                        <Trans i18nKey='modal.configSettings.windowHint' components={{ b: <b /> }} />
                      </li>
                      <li>
                        <Trans i18nKey='modal.configSettings.documentHint' components={{ b: <b /> }} />
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
            {t('common.save')}
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
