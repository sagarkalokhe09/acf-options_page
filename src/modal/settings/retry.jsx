import React from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Form, FormControl, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common'

const SettingRetry = ({ settings, onUpdate }) => {
  const { t } = useTranslation()
  return (
    <Card>
      <Card.Body>
        <Row className='mb-2 mb-md-0'>
          <Col md={6} sm={12}>
            <Form.Group controlId='retry'>
              <FormControl placeholder='5' autoComplete='off' name='retry' defaultValue={settings.retry} onBlur={onUpdate} type='number' pattern='NUMBER' list='retry' />
              <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
              <Form.Label>{t('modal.settings.retry.title')}</Form.Label>
            </Form.Group>
          </Col>
          <Col md={6} sm={12}>
            <Form.Group controlId='retryInterval'>
              <FormControl placeholder='1' autoComplete='off' name='retryInterval' defaultValue={settings.retryInterval} onBlur={onUpdate} pattern='INTERVAL' list='interval' />
              <Form.Label>
                {t('modal.settings.retry.interval')}&nbsp;<small>({t('common.sec')})</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} className='mb-2'>
            <Form.Text className='text-muted'>{t('modal.settings.retry.hint')}</Form.Text>
          </Col>
          <Col xs={12} className='d-flex justify-content-between'>
            <Form.Check type='radio' value={RETRY_OPTIONS.STOP} checked={settings.retryOption === RETRY_OPTIONS.STOP} onChange={onUpdate} name='retryOption' label={t('modal.settings.retry.stop')} />
            <Form.Check type='radio' value={RETRY_OPTIONS.SKIP} checked={settings.retryOption === RETRY_OPTIONS.SKIP} onChange={onUpdate} name='retryOption' label={t('modal.settings.retry.skip')} />
            <Form.Check
              type='radio'
              value={RETRY_OPTIONS.RELOAD}
              checked={settings.retryOption === RETRY_OPTIONS.RELOAD}
              onChange={onUpdate}
              name='retryOption'
              label={t('modal.settings.retry.refresh')}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

SettingRetry.propTypes = {
  settings: PropTypes.shape({
    retry: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    retryInterval: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    retryOption: PropTypes.string
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
}
export { SettingRetry }
