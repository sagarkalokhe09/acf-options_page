import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { NavDropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Service, StorageService } from '@dhruv-techapps/core-services'
import { AUTO_BACKUP, defaultSettings, LOCAL_STORAGE_KEY, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common'
import { CloudArrowUpFill } from '../util'

export function BackupDropdown({ confirmRef }) {
  const [settings, setSettings] = useState(defaultSettings)

  const { t } = useTranslation()

  useEffect(() => {
    StorageService.get(window.EXTENSION_ID, LOCAL_STORAGE_KEY.SETTINGS).then(result => {
      setSettings(result.settings || defaultSettings)
    })
  }, [])

  useEffect(() => {
    StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.SETTINGS]: settings })
  }, [settings])

  const backup = autoBackup => {
    if (autoBackup) {
      setSettings({ ...settings, backup: { autoBackup } })
    }
    Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.BACKUP, autoBackup })
  }

  const restore = () => {
    confirmRef.current.confirm({
      title: t('confirm.backup.restore.title'),
      message: t('confirm.backup.restore.message'),
      headerClass: 'text-danger',
      confirmFunc: () => {
        Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.BACKUP, restore: true })
      }
    })
  }

  const {
    backup: { autoBackup, lastBackup }
  } = settings

  return (
    <NavDropdown title={<CloudArrowUpFill width='24' height='24' title={t('header.backup.backup')} style={{ color: 'var(--bs-blue)' }} />} id='backup' align='end' className='px-2 py-2 fw-bolder'>
      {lastBackup && (
        <>
          <NavDropdown.Header>{t('header.backup.last-backup')}</NavDropdown.Header>
          <NavDropdown.ItemText>{lastBackup}</NavDropdown.ItemText>
          <NavDropdown.Divider />
        </>
      )}
      <NavDropdown.Item href='#backup-now' title={t('header.backup.now')} onClick={() => backup()}>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-cloud-arrow-up-fill me-2' viewBox='0 0 16 16'>
          <path d='M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z' />
        </svg>
        {t('header.backup.now')}
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Header>{t('header.backup.auto-backup')}</NavDropdown.Header>
      <NavDropdown.Item href='#backup-daily' title={t('header.backup.daily')} active={autoBackup === AUTO_BACKUP.DAILY} onClick={() => backup(AUTO_BACKUP.DAILY)}>
        {t('header.backup.daily')}
      </NavDropdown.Item>
      <NavDropdown.Item href='#backup-weekly' title={t('header.backup.weekly')} active={autoBackup === AUTO_BACKUP.WEEKLY} onClick={() => backup(AUTO_BACKUP.WEEKLY)}>
        {t('header.backup.weekly')}
      </NavDropdown.Item>
      <NavDropdown.Item href='#backup-monthly' title={t('header.backup.monthly')} active={autoBackup === AUTO_BACKUP.MONTHLY} onClick={() => backup(AUTO_BACKUP.MONTHLY)}>
        {t('header.backup.monthly')}
      </NavDropdown.Item>
      <NavDropdown.Item href='#backup-off' title={t('header.backup.off')} active={!autoBackup || autoBackup === AUTO_BACKUP.OFF} onClick={() => backup(AUTO_BACKUP.OFF)}>
        {t('header.backup.off')}
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item href='#backup-restore' title={t('header.backup.restore')} onClick={restore} className='text-danger'>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-cloud-arrow-down-fill me-2' viewBox='0 0 16 16'>
          <path d='M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z' />
        </svg>
        {t('header.backup.restore')}
      </NavDropdown.Item>
    </NavDropdown>
  )
}
BackupDropdown.defaultProps = {}

BackupDropdown.propTypes = {
  confirmRef: PropTypes.shape({ current: PropTypes.shape({ confirm: PropTypes.func.isRequired }) }).isRequired
}
