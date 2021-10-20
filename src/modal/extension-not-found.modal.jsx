import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { BROWSER } from '@dhruv-techapps/core-common'
import { Trans, useTranslation } from 'react-i18next'

const ExtensionNotFoundModel = forwardRef((_, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    show() {
      if (!show) {
        setShow(true)
      }
    }
  }))

  const closeClick = () => {
    setShow(false)
  }

  const downloadClick = () => {
    const webStore = process.env[`REACT_APP_${BROWSER}_WEB_STORE`]
    const extensionId = process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]
    window.open(`${webStore}${extensionId}`)
    setShow(false)
  }

  return (
    <Modal show={show} centered backdrop='static' keyboard={false}>
      <Modal.Body className='p-4 text-center'>
        <h5>{t('modal.extensionNotFound.title')}</h5>
        <p className='mb-0'>
          <Trans i18nKey='modal.extensionNotFound.subTitle' components={{ b: <span className='text-primary' />, Badge: <span className='text-primary' /> }} values={process.env} />.
          {t('modal.extensionNotFound.hint')}
        </p>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant='link' className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end' size='lg' onClick={closeClick}>
          {t('common.close')}
        </Button>
        <Button variant='link' className='fs-6 text-decoration-none col-6 m-0 rounded-0' size='lg' onClick={downloadClick}>
          <strong>{t('common.download')}</strong>
        </Button>
      </Modal.Footer>
    </Modal>
  )
})
ExtensionNotFoundModel.displayName = 'ExtensionNotFoundModel'
export { ExtensionNotFoundModel }
