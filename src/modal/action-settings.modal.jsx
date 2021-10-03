import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Alert, Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { GTAG, REGEX_NUM, convertNumberField } from '../util'

const NUMBER_FIELDS = ['retry', 'retryInterval']

const ActionSettingsModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    errors,
    reset,
    formState: { isDirty, isValid }
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true
  })
  const [show, setShow] = useState(false)
  const actionIndex = useRef(-1)

  const onSubmit = data => {
    const requestData = {}
    Object.keys(data).forEach(prop => {
      if (data[prop]) {
        requestData[prop] = data[prop]
      }
    })
    convertNumberField(requestData, NUMBER_FIELDS)
    reset(data)
    setConfigs(configs =>
      configs.map((config, index) => {
        if (index === configIndex) {
          if (!config.actions[actionIndex.current]) {
            config.actions[actionIndex.current] = {}
          }
          config.actions[actionIndex.current].settings = { ...requestData }
          return { ...config }
        }
        return config
      })
    )
    setShow(false)
    GTAG.event({ category: 'Action-Settings', action: 'Click', label: 'Save' })
  }

  const onReset = () => {
    reset({})
    setConfigs(configs =>
      configs.map((config, index) => {
        if (index === configIndex && config.actions[actionIndex.current]) {
          delete config.actions[actionIndex.current].settings
          return { ...config }
        }
        return config
      })
    )
    GTAG.event({ category: 'Action-Settings', action: 'Click', label: 'Reset' })
  }

  useImperativeHandle(ref, () => ({
    showSettings(index, settings) {
      GTAG.modalview({ title: 'Action Settings', url: window.location.href, path: '/settings/action' })
      actionIndex.current = index
      reset({ ...settings })
      setShow(true)
    }
  }))

  const handleClose = () => {
    setShow(false)
    GTAG.event({ category: 'Action-Settings', action: 'Click', label: 'Close' })
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose}>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.actionSettings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant='info'>{t('modal.actionSettings.info')}</Alert>
          <Card className='mb-2'>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  <Form.Check type='switch' id='iframeFirst' name='iframeFirst' ref={register} label={t('modal.actionSettings.iframeFirst')} />
                  <small className='text-muted'>{t('modal.actionSettings.iframeFirstHint')}</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className='mb-2'>
            <Card.Body>
              <Row>
                <Col md={6} sm={12} className='mb-2 mb-md-0'>
                  <Form.Group controlId='retry'>
                    <FormControl placeholder='5' aria-label='5' name='retry' aria-describedby='retry' ref={register({ pattern: REGEX_NUM })} isInvalid={errors.retry} list='retry' />
                    <Form.Label>{t('modal.actionSettings.retry.title')}</Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.retry && t('modal.actionSettings.retry.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group controlId='retry-interval'>
                    <FormControl
                      placeholder='1'
                      aria-label='1'
                      name='retryInterval'
                      list='interval'
                      aria-describedby='retry-interval'
                      ref={register({ validate: value => !Number.isNaN(value) })}
                      isInvalid={errors.retryInterval}
                    />
                    <Form.Label>
                      {t('modal.actionSettings.retry.interval')}&nbsp;<small className='text-info'>({t('common.sec')})</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.retryInterval && t('modal.actionSettings.retry.interval.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <h6 className='my-2 text-secondary font-weight-light'>
                    <small>{t('modal.actionSettings.retry.hint')}</small>
                  </h6>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' name='retryOption' id='retryOptionStop' value={RETRY_OPTIONS.STOP} ref={register} label={t('modal.actionSettings.retry.stop')} />
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' name='retryOption' id='retryOptionSkip' value={RETRY_OPTIONS.SKIP} ref={register} label={t('modal.actionSettings.retry.skip')} />
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' name='retryOption' id='retryOptionReload' value={RETRY_OPTIONS.RELOAD} ref={register} label={t('modal.actionSettings.retry.refresh')} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='reset' variant='outline-danger'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='outline-primary' disabled={!isValid || !isDirty} className='ml-3'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})

ActionSettingsModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
const memo = React.memo(ActionSettingsModal)
export { memo as ActionSettingsModal }
