import { Badge, Button, Modal } from 'react-bootstrap'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { BROWSER } from '@dhruv-techapps/core-common'
import { useTranslation } from 'react-i18next'

const ExtensionNotFoundModel = forwardRef((_, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true)
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
          {t('modal.extensionNotFound.subTitle', process.env.REACT_APP_NAME, process.env.REACT_APP_VARIANT && <Badge variant='danger ml-2 font-weight-light'>{process.env.REACT_APP_VARIANT}</Badge>)}
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
const memo = ExtensionNotFoundModel
export { memo as ExtensionNotFoundModel }
