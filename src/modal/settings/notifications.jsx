import React from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { VolumeMute, VolumeUp } from '../../util'
import { getElementProps } from '../../util/element'
import { dataLayerInput } from '../../util/data-layer'
import { SettingDiscord } from './discord'

function SettingNotifications({ notifications, setSettings }) {
  const { t } = useTranslation()

  const onUpdate = e => {
    const update = getElementProps(e)
    dataLayerInput(update, 'settings')
    setSettings(settings => ({ ...settings, notifications: { ...settings.notifications, ...update } }))
  }

  return (
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title as='h6' className='text-muted fw-normal'>
          {t('modal.settings.notification.title')}
        </Card.Title>
        <Row>
          <Col md={6} sm={12}>
            <Form.Check type='switch' name='onError' checked={notifications.onError} onChange={onUpdate} label={t('modal.settings.notification.error')} />
            <Form.Check type='switch' name='onAction' checked={notifications.onAction} onChange={onUpdate} label={t('modal.settings.notification.action')} />
            <Form.Check type='switch' name='onBatch' checked={notifications.onBatch} onChange={onUpdate} label={t('modal.settings.notification.batch')} />
            <Form.Check type='switch' name='onConfig' checked={notifications.onConfig} onChange={onUpdate} label={t('modal.settings.notification.config')} />
          </Col>
          <Col className='d-flex justify-content-around flex-column' md={6} sm={12}>
            <Form.Check
              type='switch'
              onChange={onUpdate}
              name='sound'
              checked={notifications.sound}
              label={
                <span>
                  {t('modal.settings.notification.sound')} {notifications.sound ? <VolumeUp /> : <VolumeMute />}
                </span>
              }
            />
            <SettingDiscord onChange={onUpdate} checked={notifications.discord} label={t('modal.settings.notification.discord.title')} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

SettingNotifications.propTypes = {
  notifications: PropTypes.shape({
    onError: PropTypes.bool,
    onAction: PropTypes.bool,
    onBatch: PropTypes.bool,
    onConfig: PropTypes.bool,
    sound: PropTypes.bool,
    discord: PropTypes.bool
  }).isRequired,
  setSettings: PropTypes.func.isRequired
}
export { SettingNotifications }
