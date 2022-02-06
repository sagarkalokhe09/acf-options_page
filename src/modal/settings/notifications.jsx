import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { VolumeMute, VolumeUp } from '../../util'
import { AuthContext } from '../../_providers'
import { getElementProps } from '../../util/element'

function SettingNotifications({ notifications, setSettings }) {
  const { t } = useTranslation()
  const user = useContext(AuthContext)
  const onUpdate = e => {
    const update = getElementProps(e)
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
            <Form.Check type='switch' disabled={!user} onChange={onUpdate} checked={notifications.discord} name='discord' label={t('modal.settings.notification.discord.title')} />
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
