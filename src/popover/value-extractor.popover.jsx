import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { InfoCircle } from '../util'

export function ValueExtractorPopover() {
  const { t } = useTranslation()

  return (
    <OverlayTrigger
      trigger='click'
      placement='right'
      rootClose
      overlay={
        <Popover id='popover-basic'>
          <Popover.Header>{t('common.examples')}</Popover.Header>
          <Popover.Body>
            <ul>
              <li>
                <code>\d+.\d*</code> float number extract $<span className='text-primary'>123.00</span> only
              </li>
              <li>
                <code>\d+</code> number extract $<span className='text-primary'>123</span>.00 only
              </li>
              <li>supports regex pattern</li>
            </ul>
          </Popover.Body>
        </Popover>
      }>
      <InfoCircle className='ms-2 text-muted' />
    </OverlayTrigger>
  )
}
