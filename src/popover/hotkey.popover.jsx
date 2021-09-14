import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { InfoCircle } from '../util'

export const HotkeyPopover = () => {
  const { t } = useTranslation()
  return (
    <OverlayTrigger
      trigger='click'
      placement='right'
      rootClose
      overlay={
        <Popover id='popover-basic'>
          <Popover.Title>{t('popover.hotkey.title')}</Popover.Title>
          <Popover.Content>
            <p>{t('popover.hotkey.content')}</p>
            <ul>
              <li>Ctrl + A</li>
              <li>Ctrl + Shift + A</li>
              <li>Alt + A</li>
              <li>Alt + Shift + A</li>
              <li>Ctrl + Alt + Shift + A</li>
            </ul>
            <span className='text-danger'>
              <Trans i18nKey='popover.hotkey.hint' components={{ kbd: <kbd /> }}>
                Single letter without <kbd>Ctrl</kbd>, <kbd>Alt</kbd> or <kbd>Shift</kbd> is not valid
              </Trans>
            </span>
          </Popover.Content>
        </Popover>
      }>
      <InfoCircle className='ml-2 text-info' />
    </OverlayTrigger>
  )
}
