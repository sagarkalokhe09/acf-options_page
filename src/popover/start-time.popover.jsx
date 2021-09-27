import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { InfoCircle } from '../util'

export const StartTimePopover = () => (
  <OverlayTrigger
    trigger='click'
    placement='left'
    rootClose
    overlay={
      <Popover id='popover-basic'>
        <Popover.Body>
          <p>
            <Trans i18nKey='popover.startTime.content'>
              Try
              <a href='https://scheduleurl.com/docs/1.0/getting-started/download/' target='_blank' rel='noopener noreferrer'>
                Schedule URL
              </a>
              our new browser extension.
              <br /> it&apos;s used to schedule webpage / URL at particular day and time.
            </Trans>
          </p>
        </Popover.Body>
      </Popover>
    }>
    <InfoCircle className='ml-2 text-info' />
  </OverlayTrigger>
)
