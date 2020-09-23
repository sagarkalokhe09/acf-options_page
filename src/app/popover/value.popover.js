import React from 'react'
import { OverlayTrigger, Popover, Table } from 'react-bootstrap'
import { ReactComponent as InfoCircle } from 'bootstrap-icons/icons/info-circle.svg'

export const ValuePopover = () => <OverlayTrigger trigger="click" placement="right" rootClose overlay={<Popover id="popover-basic" >
  <Popover.Content>
    <Table bordered striped className="mt-3">
      <tbody>
        <tr>
          <td><a href="https://getautoclicker.com/docs/action#scroll-to-examples" target="_blank" rel="noopener noreferrer">Scroll To</a></td>
          <td><code>ScrollTo::Bottom</code></td>
        </tr>
        <tr>
          <td><a href="https://getautoclicker.com/docs/action#click-events-examples" target="_blank" rel="noopener noreferrer">Click Events</a></td>
          <td><code>ClickEvents::dblclick</code></td>
        </tr>
        <tr>
          <td><a href="https://getautoclicker.com/docs/action#form-events-examples" target="_blank" rel="noopener noreferrer">Form Events</a></td>
          <td><code>FormEvents::submit</code></td>
        </tr>
        <tr>
          <td><a href="https://getautoclicker.com/docs/action#exec-command-examples" target="_blank" rel="noopener noreferrer">Exec Command</a></td>
          <td><code>ExecCommand::[&quot;cut&quot;,&quot;paste&quot;]</code></td>
        </tr>
        <tr>
          <td>Plain text</td>
          <td><code>Hello World</code></td>
        </tr>
      </tbody>
    </Table>
  </Popover.Content>
</Popover>}><InfoCircle className="ml-2 text-info"/></OverlayTrigger>
