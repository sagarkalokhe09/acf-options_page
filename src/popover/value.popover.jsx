import { OverlayTrigger, Popover, Table } from 'react-bootstrap'
import React from 'react'
import { InfoCircle } from '../util'

export const ValuePopover = () => (
  <OverlayTrigger
    trigger='click'
    placement='right'
    rootClose
    overlay={
      <Popover id='popover-basic'>
        <Popover.Content>
          <Table bordered striped className='mt-3'>
            <tbody>
              <tr>
                <td>
                  <a href={`${process.env.REACT_APP_DOCS}action/value/#query-param`} target='_blank' rel='noopener noreferrer'>
                    Query Param
                  </a>
                </td>
                <td>
                  <code>Query::param</code>
                </td>
              </tr>
              <tr>
                <td>
                  <a href={`${process.env.REACT_APP_DOCS}action/value/#select-option`} target='_blank' rel='noopener noreferrer'>
                    Select Option
                  </a>
                </td>
                <td>
                  <code>true</code>
                </td>
              </tr>
              <tr>
                <td>
                  <a href={`${process.env.REACT_APP_DOCS}action/value/#scroll-to-examples`} target='_blank' rel='noopener noreferrer'>
                    Scroll To
                  </a>
                </td>
                <td>
                  <code>ScrollTo::Bottom</code>
                </td>
              </tr>
              <tr>
                <td>
                  <a href={`${process.env.REACT_APP_DOCS}action/value/#click-events--mouse-events-examples`} target='_blank' rel='noopener noreferrer'>
                    Click Events
                  </a>
                </td>
                <td>
                  <code>ClickEvents::dblclick</code>
                </td>
              </tr>
              <tr>
                <td>
                  <a href={`${process.env.REACT_APP_DOCS}action/value/#form-events-examples`} target='_blank' rel='noopener noreferrer'>
                    Form Events
                  </a>
                </td>
                <td>
                  <code>FormEvents::submit</code>
                </td>
              </tr>
              <tr>
                <td>
                  <a href={`${process.env.REACT_APP_DOCS}action/value/#batch-repeat`} target='_blank' rel='noopener noreferrer'>
                    Batch Repeat
                  </a>
                </td>
                <td>
                  <code>email&lt;batchRepeat&gt; -&gt; email1, email2</code>
                </td>
              </tr>
              {/* <tr>
          <td><a href={process.env.REACT_APP_DOCS + 'action/exec-command-examples'} target="_blank" rel="noopener noreferrer">Exec Command</a></td>
          <td><code>ExecCommand::[&quot;cut&quot;,&quot;paste&quot;]</code></td>
        </tr> */}
              <tr>
                <td>
                  <a href={`${process.env.REACT_APP_DOCS}action/value/#location-command`} target='_blank' rel='noopener noreferrer'>
                    Location Command
                  </a>
                </td>
                <td>
                  <code>LocationCommand::href::https://getautoclicker.com</code>
                </td>
              </tr>
              <tr>
                <td>Plain text</td>
                <td>
                  <code>Hello World</code>
                </td>
              </tr>
            </tbody>
          </Table>
          <div className='text-right'>
            <a href={`${process.env.REACT_APP_DOCS}action/value`} target='_blank' rel='noopener noreferrer'>
              more
            </a>
          </div>
        </Popover.Content>
      </Popover>
    }>
    <InfoCircle className='ml-2 text-info' />
  </OverlayTrigger>
)
