import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { ReactComponent as InfoCircle } from 'bootstrap-icons/icons/info-circle.svg'

export const StartTimePopover = () => <OverlayTrigger trigger="click" placement="right" rootClose overlay={<Popover id="popover-basic">
  <Popover.Title>Examples</Popover.Title>
  <Popover.Content>
    <ul>
      <li><code>13:00:00</code> at afternoon 1 PM</li>
      <li><code>00:00:00</code> at midnight 12 AM</li>
      <li><code>15:15:15</code> at afternoon 3 PM and 15 mins and 15 seconds</li>
      <li><code>empty blank</code> start immediately</li>
    </ul>
  </Popover.Content>
</Popover>}><InfoCircle className="ml-2 text-info"/></OverlayTrigger>
