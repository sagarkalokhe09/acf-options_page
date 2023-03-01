import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { StorageService } from '@dhruv-techapps/core-services'
import { LOCAL_STORAGE_KEY, defaultSettings } from '@dhruv-techapps/acf-common'
import { Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ErrorAlert } from '../components/error-alert.components'
import { ModeContext } from '../_providers'
import { getElementProps } from '../util/element'
import { SettingNotifications } from './settings/notifications'
import { SettingRetry } from './settings/retry'
import { dataLayerInput, dataLayerModel } from '../util/data-layer'
import { SettingMessage } from './settings/message'

const SettingsModal = forwardRef((_, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const { mode, setMode } = useContext(ModeContext)
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState()
  const messageRef = useRef()

  const handleClose = () => {
    dataLayerModel(LOCAL_STORAGE_KEY.SETTINGS, 'close')
    setShow(false)
  }

  useImperativeHandle(ref, () => ({
    showSettings() {
      setShow(true)
    }
  }))

  useEffect(() => {
    StorageService.get(window.EXTENSION_ID, LOCAL_STORAGE_KEY.SETTINGS)
      .then(result => {
        setSettings(result.settings || defaultSettings)
      })
      .catch(setApiError)
      .finally(() => setLoading(false))
  }, [])

  const save = data => {
    StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.SETTINGS]: data })
      .then(() => {
        messageRef.current.showMessage(t('modal.settings.saveMessage'))
      })
      .catch(setApiError)
  }

  const onUpdate = e => {
    const update = getElementProps(e)
    if (update) {
      dataLayerInput(update, LOCAL_STORAGE_KEY.SETTINGS)
      setSettings(_settings => ({ ..._settings, ...update }))
    }
  }

  useEffect(() => {
    if (!loading) {
      save(settings)
    }
  }, [settings])

  const toggleMode = () => {
    dataLayerInput({ mode: mode === 'light' ? 'pro' : 'light' }, LOCAL_STORAGE_KEY.SETTINGS)
    setMode(prevMode => (prevMode === 'light' ? 'pro' : 'light'))
  }

  return (
    <Modal show={show} onHide={handleClose} size='lg' onShow={() => dataLayerModel(LOCAL_STORAGE_KEY.SETTINGS, 'open')}>
      <Form>
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
              {apiError && <ErrorAlert message={apiError} />}
              <Card className='mb-3'>
                <Card.Body>
                  <Row>
                    <Col md={6} sm={12}>
                      <Form.Check type='switch' name='checkiFrames' onChange={onUpdate} checked={settings.checkiFrames} label={t('modal.settings.checkIFrames')} />
                      <small className='text-muted'>{t('modal.settings.checkIFramesHint')}</small>
                    </Col>
                    <Col md={6} sm={12}>
                      <Form.Check type='switch' checked={mode === 'pro'} onChange={toggleMode} label={t('modal.settings.advance')} />
                      <small className='text-muted'>{t('modal.settings.advanceHint')}</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <SettingNotifications notifications={settings.notifications} setSettings={setSettings} />
              <SettingRetry settings={settings} onUpdate={onUpdate} />
            </>
          )}
        </Modal.Body>
        <SettingMessage ref={messageRef} />
      </Form>
    </Modal>
  )
})

SettingsModal.displayName = 'SettingsModal'
const memo = SettingsModal
export { memo as SettingsModal }
