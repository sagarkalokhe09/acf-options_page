import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { ReactComponent as InfoCircle } from 'bootstrap-icons/icons/info-circle.svg'

export const HotkeyPopover = () => <OverlayTrigger trigger="click" placement="right" rootClose overlay={<Popover id="popover-basic">
  <Popover.Title>Hotkey</Popover.Title>
  <Popover.Content>
    <p>Press hotkey on keyboard to auto type in field</p>
    <ul>
      <li>
        Ctrl + A
      </li>
      <li>
        Ctrl + Shift + A
      </li>
      <li>
        Alt + A
      </li>
      <li>
        Alt + Shift + A
      </li>
      <li>
        Ctrl + Alt + Shift + A
      </li>
    </ul>
    <span className="text-danger">Single letter without <kbd>Ctrl</kbd>, <kbd>Alt</kbd> or <kbd>Shift</kbd> is not valid</span>
  </Popover.Content>
</Popover>}><InfoCircle className="ml-2 text-info"/></OverlayTrigger>
