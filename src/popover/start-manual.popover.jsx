import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { InfoCircle } from '../util'

export const StartManualPopover = () => (
  <OverlayTrigger
    trigger='click'
    placement='bottom-end'
    rootClose
    overlay={
      <Popover id='popover-basic'>
        <Popover.Title>Start manually using hotkey</Popover.Title>
        <Popover.Content>
          When enabled you need to make use of hot key <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> to run extension manually. <br />
          Hotkey can be changed under settings.
        </Popover.Content>
      </Popover>
    }>
    <InfoCircle className='ml-2 text-info' />
  </OverlayTrigger>
)
