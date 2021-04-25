import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { InfoCircle } from '../util'

export const ValueExtractorPopover = () => (
  <OverlayTrigger
    trigger='click'
    placement='right'
    rootClose
    overlay={
      <Popover id='popover-basic'>
        <Popover.Title>Examples</Popover.Title>
        <Popover.Content>
          <ul>
            <li>
              <code>\d+.\d*</code> float number extract $<span className='text-success'>123.00</span> only
            </li>
            <li>
              <code>\d+</code> number extract $<span className='text-success'>123</span>.00 only
            </li>
            <li>supports regex pattern</li>
          </ul>
        </Popover.Content>
      </Popover>
    }>
    <InfoCircle className='ml-2 text-info' />
  </OverlayTrigger>
)
