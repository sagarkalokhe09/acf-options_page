import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { defaultActionSetting, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { useTranslation } from 'react-i18next'

import { getElementProps, updateForm } from '../util/element'
import { dataLayerInput, dataLayerModel } from '../util/data-layer'

const FORM_ID = 'action-settings'

const ActionSettingsModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [settings, setSettings] = useState(defaultActionSetting)
  const [message, setMessage] = useState()
  const actionIndex = useRef(-1)
  const updateRef = useRef(false)

  const onUpdate = e => {
    const update = getElementProps(e)
    if (update) {
      updateRef.current = true
      dataLayerInput(update, 'action-settings')
      setSettings(_settings => ({ ..._settings, ...update }))
    }
  }

  const handleClose = () => {
    dataLayerModel('action-settings', 'close')
    setShow(false)
  }

  useEffect(() => {
    if (updateRef.current) {
      setConfigs(configs =>
        configs.map((config, index) => {
          if (index === configIndex) {
            if (!config.actions[actionIndex.current]) {
              config.actions[actionIndex.current] = {}
            }
            config.actions[actionIndex.current].settings = { ...settings }
            return { ...config }
          }
          return config
        })
      )

      updateRef.current = false
      setMessage(t('modal.actionSettings.saveMessage'))
      setTimeout(setMessage, 1500)
    }
  }, [settings])

  useEffect(() => {
    if (actionIndex.current !== -1) {
      updateForm(FORM_ID, settings)
    }
  }, [actionIndex.current])

  const onReset = () => {
    updateRef.current = true
    setSettings({})
    handleClose()
  }

  useImperativeHandle(ref, () => ({
    showSettings(index, _settings) {
      actionIndex.current = index
      setSettings({ ..._settings })
      setShow(true)
    }
  }))

  return (
    <Modal show={show} size='lg' onHide={handleClose} onShow={() => dataLayerModel('action-settings', 'open')}>
      <Form id={FORM_ID}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.actionSettings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-muted'>{t('modal.actionSettings.info')}</p>
          <Card className='mb-3'>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  <Form.Check type='switch' name='iframeFirst' value={settings.iframeFirst} checked={settings.iframeFirst} onChange={onUpdate} label={t('modal.actionSettings.iframeFirst')} />
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
                    <FormControl placeholder={t('modal.actionSettings.retry.title')} name='retry' type='number' onBlur={onUpdate} defaultValue={settings.retry} pattern='NUMBER' list='retry' />
                    <Form.Label>{t('modal.actionSettings.retry.title')}</Form.Label>
                    <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group controlId='retry-interval'>
                    <FormControl
                      placeholder={`${t('modal.actionSettings.retry.interval')} (${t('common.sec')})`}
                      list='interval'
                      onBlur={onUpdate}
                      name='retryInterval'
                      defaultValue={settings.retryInterval}
                      pattern='INTERVAL'
                    />
                    <Form.Label>
                      {t('modal.actionSettings.retry.interval')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12} className='mb-2'>
                  <Form.Text className='text-muted'>{t('modal.actionSettings.retry.hint')}</Form.Text>
                </Col>
                <Col xs={12} className='d-flex justify-content-between'>
                  <Form.Check
                    type='radio'
                    value={RETRY_OPTIONS.STOP}
                    checked={settings.retryOption === RETRY_OPTIONS.STOP}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.stop')}
                  />
                  <Form.Check
                    type='radio'
                    value={RETRY_OPTIONS.SKIP}
                    checked={settings.retryOption === RETRY_OPTIONS.SKIP}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.skip')}
                  />
                  <Form.Check
                    type='radio'
                    value={RETRY_OPTIONS.RELOAD}
                    checked={settings.retryOption === RETRY_OPTIONS.RELOAD}
                    onChange={onUpdate}
                    name='retryOption'
                    label={t('modal.actionSettings.retry.refresh')}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='reset' variant='outline-primary px-5' onClick={onReset}>
            {t('common.clear')}
          </Button>
          <span className='text-success'>{message}</span>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})

ActionSettingsModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
ActionSettingsModal.displayName = 'ActionSettingsModal'
const memo = React.memo(ActionSettingsModal)
export { memo as ActionSettingsModal }
