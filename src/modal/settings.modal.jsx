import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { StorageService } from '@dhruv-techapps/core-services'
import { LOCAL_STORAGE_KEY, defaultSettings } from '@dhruv-techapps/acf-common'
import { Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ErrorAlert } from '../components/error-alert.components'
import { ModeContext } from '../_providers'
import { getElementProps } from '../util/element'
import { SettingNotifications } from './settings/notifications'
import { SettingRetry } from './settings/retry'

function SettingsModal({ show, handleClose }) {
  const { t } = useTranslation()
  const { mode, setMode } = useContext(ModeContext)
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState()
  const [message, setMessage] = useState()

  useEffect(() => {
    StorageService.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSettings)
      .then(setSettings)
      .catch(setApiError)
      .finally(() => setLoading(false))
  }, [])

  const save = data => {
    StorageService.setItem(LOCAL_STORAGE_KEY.SETTINGS, data)
      .then(() => {
        setMessage(t('modal.settings.saveMessage'))
        setTimeout(setMessage, 1500)
      })
      .catch(setApiError)
      .finally(() => setLoading(false))
  }

  const onUpdate = e => {
    const update = getElementProps(e)
    if (update) {
      setSettings(_settings => ({ ..._settings, ...update }))
    }
  }

  useEffect(() => {
    if (!loading) {
      save(settings)
    }
  }, [settings])

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'pro' : 'light'))
  }

  return (
    <Modal show={show} onHide={handleClose} size='lg'>
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
        {message && (
          <Modal.Footer>
            <span className='text-success'>{message}</span>
          </Modal.Footer>
        )}
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
