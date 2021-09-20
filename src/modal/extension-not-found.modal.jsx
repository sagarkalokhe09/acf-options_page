import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'
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
      <Modal.Header>
        <Modal.Title>{t('modal.extensionNotFound.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='mx-auto text-center'>
        <p>
          <Trans i18nKey='modal.extensionNotFound.subTitle' components={{ b: <b />, Badge: <Badge variant='danger' className='ml-2 font-weight-light' /> }} values={process.env} />
        </p>
        <p>{t('modal.extensionNotFound.hint')}</p>
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button variant='outline-secondary' className='px-3' size='md' onClick={closeClick}>
          {t('common.close')}
        </Button>
        <Button variant='outline-primary' className='px-3' size='md' onClick={downloadClick}>
          {t('common.download')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
})
ExtensionNotFoundModel.displayName = 'ExtensionNotFoundModel'
export { ExtensionNotFoundModel }
