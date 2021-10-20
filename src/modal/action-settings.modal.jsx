import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { GTAG, REGEX_NUM, clearEmptyField, convertNumberField, REGEX_INTERVAL } from '../util'

const ActionSettingsModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true
  })
  const [show, setShow] = useState(false)
  const actionIndex = useRef(-1)

  const onSubmit = data => {
    clearEmptyField(data)
    convertNumberField(data)
    reset(data)
    setConfigs(configs =>
      configs.map((config, index) => {
        if (index === configIndex) {
          if (!config.actions[actionIndex.current]) {
            config.actions[actionIndex.current] = {}
          }
          config.actions[actionIndex.current].settings = { ...data }
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
          <Modal.Title as='h6'>{t('modal.actionSettings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-muted'>{t('modal.actionSettings.info')}</p>
          <Card className='mb-3'>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  <Form.Check type='switch' id='iframeFirst' {...register('iframeFirst')} label={t('modal.actionSettings.iframeFirst')} />
                  <small className='text-muted'>{t('modal.actionSettings.iframeFirstHint')}</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Row className='mb-2 mb-md-0'>
                <Col md={6} sm={12}>
                  <Form.Group controlId='retry'>
                    <FormControl
                      placeholder={t('modal.actionSettings.retry.title')}
                      aria-label={t('modal.actionSettings.retry.title')}
                      aria-describedby='retry'
                      {...register('retry', { pattern: REGEX_NUM })}
                      type='number'
                      pattern={REGEX_NUM}
                      isInvalid={errors.retry}
                      list='retry'
                    />
                    <Form.Label>{t('modal.actionSettings.retry.title')}</Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.retry && t('modal.actionSettings.retry.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group controlId='retry-interval'>
                    <FormControl
                      placeholder={`${t('modal.actionSettings.retry.interval')} (${t('common.sec')})`}
                      aria-label={`${t('modal.actionSettings.retry.interval')} (${t('common.sec')})`}
                      list='interval'
                      aria-describedby='retry-interval'
                      {...register('retryInterval', { pattern: REGEX_INTERVAL })}
                      isInvalid={errors.retryInterval}
                    />
                    <Form.Label>
                      {t('modal.actionSettings.retry.interval')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.retryInterval && t('modal.actionSettings.retry.interval.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12} className='mb-2'>
                  <Form.Text className='text-muted'>{t('modal.actionSettings.retry.hint')}</Form.Text>
                </Col>
                <Col xs={12} className='d-flex justify-content-between'>
                  <Form.Check type='radio' id='retryOptionStop' value={RETRY_OPTIONS.STOP} {...register('retryOption')} label={t('modal.actionSettings.retry.stop')} />
                  <Form.Check type='radio' id='retryOptionSkip' value={RETRY_OPTIONS.SKIP} {...register('retryOption')} label={t('modal.actionSettings.retry.skip')} />
                  <Form.Check type='radio' id='retryOptionReload' value={RETRY_OPTIONS.RELOAD} {...register('retryOption')} label={t('modal.actionSettings.retry.refresh')} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='reset' variant='outline-primary px-5'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='primary px-5' disabled={!isValid || !isDirty} className='ml-3'>
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
