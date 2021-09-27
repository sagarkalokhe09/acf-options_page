import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { StorageService } from '@dhruv-techapps/core-common'
import { Loading } from '@dhruv-techapps/core-components'
import { LOCAL_STORAGE_KEY, RETRY_OPTIONS, defaultSettings } from '@dhruv-techapps/acf-common'
import { Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { GTAG, REGEX_NUM, VolumeMute, VolumeUp, convertNumberField } from '../util'
import { ErrorAlert } from '../components/error-alert.components'
import { AuthContext } from '../_providers/AuthProvider'

const NUMBER_FIELDS = ['retry', 'retryInterval']

const SettingsModal = ({ show, handleClose }) => {
  const { t } = useTranslation()
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
      // .then(reset)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = data => {
    convertNumberField(data, NUMBER_FIELDS)
    StorageService.setItem(LOCAL_STORAGE_KEY.SETTINGS, data)
      .then(() => {
        // reset(data)
        setMessage(t('modal.settings.saveMessage'))
        setTimeout(setMessage, 1500)
      })
      .catch(setError)
      .finally(() => setLoading(false))
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Save' })
  }

  return (
    <Modal show={show} onHide={handleClose} size='lg'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.settings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Loading className='d-flex justify-content-center m-5' />
          ) : (
            <>
              {error && <ErrorAlert message={error} />}
              <Card className='mb-3'>
                <Card.Body>
                  <Row>
                    <Col md={12} sm={12}>
                      <Form.Check type='switch' id='checkiFrames' {...register('checkiFrames')} label={t('modal.settings.checkIFrames')} />
                      <small className='text-muted'>{t('modal.settings.checkIFramesHint')}</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className='mb-3'>
                <Card.Header>
                  <small>{t('modal.settings.notification.title')}</small>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col>
                      <Form.Check
                        type='switch'
                        id='notifications.onError'
                        {...register('notifications.onError')}
                        label={<span className='text-danger'>{t('modal.settings.notification.error')}</span>}
                      />
                      <Form.Check
                        type='switch'
                        id='notifications.onAction'
                        {...register('notifications.onAction')}
                        label={<span className='text-success'>{t('modal.settings.notification.action')}</span>}
                      />
                      <Form.Check
                        type='switch'
                        id='notifications.onBatch'
                        {...register('notifications.onBatch')}
                        label={<span className='text-success'>{t('modal.settings.notification.batch')}</span>}
                      />
                      <Form.Check
                        type='switch'
                        id='notifications.onConfig'
                        {...register('notifications.onConfig')}
                        label={<span className='text-success'>{t('modal.settings.notification.config')}</span>}
                      />
                    </Col>
                    <Col className='d-flex justify-content-around flex-column'>
                      <Form.Check
                        type='switch'
                        id='notifications.sound'
                        {...register('notifications.sound')}
                        label={
                          <span>
                            {t('modal.settings.notification.sound')} {notificationSound ? <VolumeUp /> : <VolumeMute />}{' '}
                          </span>
                        }
                      />
                      <Form.Check type='switch' disabled={!user} id='notifications.discord' {...register('notifications.discord')} label={t('modal.settings.notification.discord.title')} />
                      <Form.Text className='text-muted'>
                        <Trans i18nKey='modal.settings.notification.discord.hint'>
                          You need to login and join our
                          <a className='text-link' target='_blank' rel='noopener noreferrer' href='https://discord.gg/hArVQns'>
                            Discord server
                          </a>
                          in order to receive notification on Discord
                        </Trans>
                      </Form.Text>
                      <Form.Text className='text-info'>
                        <Trans i18nKey='modal.settings.notification.discord.info' components={{ b: <b /> }} />
                      </Form.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className='mb-3'>
                <Card.Body>
                  <Row>
                    <Col md={6} sm={12} className='mb-2 mb-md-0'>
                      <Form.Group controlId='retry'>
                        <FormControl placeholder='5' aria-label='5' aria-describedby='retry' {...register('retry', { pattern: REGEX_NUM })} isInvalid={errors.retry} list='retry' />
                        <Form.Label>{t('modal.settings.retry.title')}</Form.Label>
                        <Form.Control.Feedback type='invalid'>{errors.retry && t('error.retry')}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} sm={12}>
                      <Form.Group controlId='retry-interval'>
                        <FormControl
                          placeholder='1'
                          aria-label='1'
                          aria-describedby='retry-interval'
                          {...register('retryInterval', { validate: value => !Number.isNaN(value) })}
                          isInvalid={errors.retryInterval}
                          list='interval'
                        />
                        <Form.Label>
                          {t('modal.settings.retry.interval')}&nbsp;<small className='text-info'>({t('common.sec')})</small>
                        </Form.Label>
                        <Form.Control.Feedback type='invalid'>{errors.retryInterval && t('error.interval')}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <h6 className='my-2 text-secondary font-weight-light'>
                        <small>{t('modal.settings.retry.hint')}</small>
                      </h6>
                    </Col>
                    <Col md={4} sm={12}>
                      <Form.Check type='radio' id='retryOptionStop' value={RETRY_OPTIONS.STOP} {...register('retryOption')} label={t('modal.settings.retry.stop')} />
                    </Col>
                    <Col md={4} sm={12}>
                      <Form.Check type='radio' id='retryOptionSkip' value={RETRY_OPTIONS.SKIP} {...register('retryOption')} label={t('modal.settings.retry.skip')} />
                    </Col>
                    <Col md={4} sm={12}>
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
          <Button type='submit' variant='outline-primary' className='ml-2' disabled={!isValid || !isDirty || error}>
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
