import React from 'react'
import PropTypes from 'prop-types'
import { Form, FormControl } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { RETRY_OPTIONS } from '@dhruv-techapps/acf-common'

function SettingRetry({ settings, onUpdate }) {
  const { t } = useTranslation()
  return (
    <ol className='list-group'>
      <li className='list-group-item'>
        <Form.Group controlId='retry' className='w-100'>
          <Form.Label>{t('modal.settings.retry.title')}</Form.Label>
          <FormControl placeholder='5' autoComplete='off' name='retry' defaultValue={settings.retry} onBlur={onUpdate} type='number' pattern='NUMBER' list='retry' />
          <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
        </Form.Group>
      </li>
      <li className='list-group-item'>
        <Form.Group controlId='retryInterval' className='w-100'>
          <Form.Label>
            {t('modal.settings.retry.interval')}&nbsp;<small>({t('common.sec')})</small>
          </Form.Label>
          <FormControl placeholder='1' autoComplete='off' name='retryInterval' defaultValue={settings.retryInterval} onBlur={onUpdate} pattern='INTERVAL' list='interval' />
          <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
        </Form.Group>
      </li>
      <li className='list-group-item d-flex flex-column'>
        <Form.Text className='text-muted'>{t('modal.settings.retry.hint')}</Form.Text>
        <div className='d-flex justify-content-between mt-3'>
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
        </div>
      </li>
    </ol>
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
