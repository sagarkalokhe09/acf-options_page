import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { InfoCircle } from '../util'

export const StartTimePopover = () => (
  <OverlayTrigger
    trigger='click'
    placement='left'
    rootClose
    overlay={
      <Popover id='popover-basic'>
        <Popover.Content>
          <p>
            <a href='https://scheduleurl.com/docs/1.0/getting-started/download/' target='_blank' rel='noopener noreferrer'>
              Schedule URL
            </a>{' '}
            is browser extension used to schedule webpage / URL at particular day and time
          </p>
        </Popover.Content>
      </Popover>
    }>
    <InfoCircle className='ml-2 text-info' />
  </OverlayTrigger>
)
