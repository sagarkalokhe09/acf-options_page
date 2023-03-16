import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ListGroup, NavDropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Service, StorageService } from '@dhruv-techapps/core-services'
import { AUTO_BACKUP, defaultSettings, GOOGLE_SCOPES_KEY, LOCAL_STORAGE_KEY, RESPONSE_CODE, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common'
import { CloudArrowUpFill } from '../../util'

export function SettingsBackup({ confirmRef }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)

  const { t } = useTranslation()

  useEffect(() => {
    StorageService.get(window.EXTENSION_ID, LOCAL_STORAGE_KEY.SETTINGS)
      .then(result => {
        setSettings(result.settings || defaultSettings)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!loading) {
      StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.SETTINGS]: settings })
    }
  }, [settings])

  const onBackup = async autoBackup => {
    if (autoBackup) {
      setSettings({ ...settings, backup: { autoBackup } })
    }
    const response = await Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.GOOGLE_OAUTH2, login: GOOGLE_SCOPES_KEY.DRIVE })
    if (response !== RESPONSE_CODE.ERROR) {
      Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, autoBackup })
    }
  }

  const restore = () => {
    confirmRef.current.confirm({
      title: t('confirm.backup.restore.title'),
      message: t('confirm.backup.restore.message'),
      headerClass: 'text-danger',
      confirmFunc: () => {
        Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP, restore: true })
      }
    })
  }

  let { backup } = settings

  if (loading) {
    return null
  }

  if (!backup) {
    backup = {}
  }

  return (
    <>
      <ol className='list-group'>
        {backup.lastBackup && (
          <ListGroup.Item as='li'>
            <NavDropdown.Header>{t('header.backup.last-backup')}</NavDropdown.Header>
            <NavDropdown.ItemText>{backup.lastBackup}</NavDropdown.ItemText>
          </ListGroup.Item>
        )}
        <ListGroup.Item as='li'>
          <NavDropdown.Item href='#backup-now' title={t('header.backup.now')} onClick={() => onBackup()}>
            <CloudArrowUpFill width='24' height='24' className='me-2' />
            {t('header.backup.now')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
      <h6 className='mt-4'>{t('header.backup.auto-backup')}</h6>
      <ol className='list-group'>
        <ListGroup.Item as='li' active={backup.autoBackup === AUTO_BACKUP.DAILY}>
          <NavDropdown.Item href='#backup-daily' title={t('header.backup.daily')} onClick={() => onBackup(AUTO_BACKUP.DAILY)}>
            {t('header.backup.daily')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={backup.autoBackup === AUTO_BACKUP.WEEKLY}>
          <NavDropdown.Item href='#backup-weekly' title={t('header.backup.weekly')} onClick={() => onBackup(AUTO_BACKUP.WEEKLY)}>
            {t('header.backup.weekly')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={backup.autoBackup === AUTO_BACKUP.MONTHLY}>
          <NavDropdown.Item href='#backup-monthly' title={t('header.backup.monthly')} onClick={() => onBackup(AUTO_BACKUP.MONTHLY)}>
            {t('header.backup.monthly')}
          </NavDropdown.Item>
        </ListGroup.Item>
        <ListGroup.Item as='li' active={!backup.autoBackup || backup.autoBackup === AUTO_BACKUP.OFF}>
          <NavDropdown.Item href='#backup-off' title={t('header.backup.off')} onClick={() => onBackup(AUTO_BACKUP.OFF)}>
            {t('header.backup.off')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
      <hr />
      <ol className='list-group'>
        <ListGroup.Item as='li'>
          <NavDropdown.Item href='#backup-restore' title={t('header.backup.restore')} onClick={restore} className='text-danger'>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-cloud-arrow-down-fill me-2' viewBox='0 0 16 16'>
              <path d='M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z' />
            </svg>
            {t('header.backup.restore')}
          </NavDropdown.Item>
        </ListGroup.Item>
      </ol>
    </>
  )
}
SettingsBackup.defaultProps = {}

SettingsBackup.propTypes = {
  confirmRef: PropTypes.shape({ current: PropTypes.shape({ confirm: PropTypes.func.isRequired }) }).isRequired
}
