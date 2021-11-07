import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { StorageService } from '@dhruv-techapps/core-services'
import { LOCAL_STORAGE_KEY, RETRY_OPTIONS, defaultSettings } from '@dhruv-techapps/acf-common'
import { Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { GTAG, REGEX_NUM, VolumeMute, VolumeUp, convertNumberField, REGEX_INTERVAL } from '../util'
import { ErrorAlert } from '../components/error-alert.components'
import { AuthContext, ModeContext } from '../_providers'

const SettingsModal = ({ show, handleClose }) => {
  const { t } = useTranslation()
  const { mode, setMode } = useContext(ModeContext)
  const user = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm({
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
    StorageService.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSettings)
      .then(reset)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = data => {
    convertNumberField(data)
    StorageService.setItem(LOCAL_STORAGE_KEY.SETTINGS, data)
      .then(() => {
        reset(data)
        setMessage(t('modal.settings.saveMessage'))
        setTimeout(setMessage, 1500)
      })
      .catch(setError)
      .finally(() => setLoading(false))
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Save' })
  }

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'pro' : 'light'))
  }
  console.log(mode)
  return (
    <Modal show={show} onHide={handleClose} size='lg'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.settings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className='text-center m-5'>
              <div className='spinner-border' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {error && <ErrorAlert message={error} />}
              <Card className='mb-3'>
                <Card.Body>
                  <Row>
                    <Col md={6} sm={12}>
                      <Form.Check type='switch' id='checkiFrames' {...register('checkiFrames')} label={t('modal.settings.checkIFrames')} />
                      <small className='text-muted'>{t('modal.settings.checkIFramesHint')}</small>
                    </Col>
                    <Col md={6} sm={12}>
                      <Form.Check type='switch' id='mode' checked={mode === 'pro'} onChange={toggleMode} label={t('modal.settings.advance')} />
                      <small className='text-muted'>{t('modal.settings.advanceHint')}</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className='mb-3'>
                <Card.Body>
                  <Card.Title as='h6' className='text-muted fw-normal'>
                    {t('modal.settings.notification.title')}
                  </Card.Title>
                  <Row>
                    <Col md={6} sm={12}>
                      <Form.Check type='switch' id='notifications.onError' {...register('notifications.onError')} label={t('modal.settings.notification.error')} />
                      <Form.Check type='switch' id='notifications.onAction' {...register('notifications.onAction')} label={t('modal.settings.notification.action')} />
                      <Form.Check type='switch' id='notifications.onBatch' {...register('notifications.onBatch')} label={t('modal.settings.notification.batch')} />
                      <Form.Check type='switch' id='notifications.onConfig' {...register('notifications.onConfig')} label={t('modal.settings.notification.config')} />
                    </Col>
                    <Col className='d-flex justify-content-around flex-column' md={6} sm={12}>
                      <Form.Check
                        type='switch'
                        id='notifications.sound'
                        {...register('notifications.sound')}
                        label={
                          <span>
                            {t('modal.settings.notification.sound')} {notificationSound ? <VolumeUp /> : <VolumeMute />}
                          </span>
                        }
                      />
                      <Form.Check type='switch' disabled={!user} id='notifications.discord' {...register('notifications.discord')} label={t('modal.settings.notification.discord.title')} />
                      <Form.Text>
                        <Trans i18nKey='modal.settings.notification.discord.hint'>
                          You need to login and join our
                          <a className='text-muted' target='_blank' rel='noopener noreferrer' href='https://discord.gg/hArVQns'>
                            Discord server
                          </a>
                          in order to receive notification on Discord
                        </Trans>
                      </Form.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className='mb-3'>
                <Card.Body>
                  <Row className='mb-2 mb-md-0'>
                    <Col md={6} sm={12}>
                      <Form.Group controlId='retry'>
                        <FormControl
                          placeholder='5'
                          aria-label='5'
                          autoComplete='off'
                          aria-describedby='retry'
                          {...register('retry', { pattern: REGEX_NUM })}
                          type='number'
                          pattern={REGEX_NUM}
                          isInvalid={errors.retry}
                          list='retry'
                        />
                        <Form.Control.Feedback type='invalid'>{errors.retry && t('error.retry')}</Form.Control.Feedback>
                        <Form.Label>{t('modal.settings.retry.title')}</Form.Label>
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12}>
                      <Form.Group controlId='retry-interval'>
                        <FormControl
                          autoComplete='off'
                          placeholder='1'
                          aria-label='1'
                          aria-describedby='retry-interval'
                          {...register('retryInterval', { pattern: REGEX_INTERVAL })}
                          isInvalid={errors.retryInterval}
                          list='interval'
                        />
                        <Form.Label>
                          {t('modal.settings.retry.interval')}&nbsp;<small>({t('common.sec')})</small>
                        </Form.Label>
                        <Form.Control.Feedback type='invalid'>{errors.retryInterval && t('error.interval')}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={12} className='mb-2'>
                      <Form.Text className='text-muted'>{t('modal.settings.retry.hint')}</Form.Text>
                    </Col>
                    <Col xs={12} className='d-flex justify-content-between'>
                      <Form.Check type='radio' id='retryOptionStop' value={RETRY_OPTIONS.STOP} {...register('retryOption')} label={t('modal.settings.retry.stop')} />
                      <Form.Check type='radio' id='retryOptionSkip' value={RETRY_OPTIONS.SKIP} {...register('retryOption')} label={t('modal.settings.retry.skip')} />
                      <Form.Check type='radio' id='retryOptionReload' value={RETRY_OPTIONS.RELOAD} {...register('retryOption')} label={t('modal.settings.retry.refresh')} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <span className='text-success'>{message}</span>
          <Button type='submit' variant='primary' className='ml-2 px-5' disabled={!isValid || !isDirty || error}>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

SettingsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}
const memo = SettingsModal
export { memo as SettingsModal }
