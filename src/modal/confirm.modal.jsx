import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ConfirmModal = forwardRef((props, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const confirm = useRef({})
  useImperativeHandle(ref, () => ({
    confirm(confirmProps) {
      confirm.current = confirmProps
      setShow(true)
    }
  }))

  const noClick = () => {
    setShow(false)
  }

  const yesClick = () => {
    confirm.current.confirmFunc()
    setShow(false)
  }

  return (
    <Modal show={show} centered backdrop='static' keyboard={false}>
      <Modal.Body className='p-4 text-center'>
        <h4 className='my-3 fw-normal'>{confirm.current.title || 'Confirm'}</h4>
        {confirm.current.message}
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant='link' className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end' size='lg' onClick={noClick}>
          {t('common.no')}
        </Button>
        <Button variant='link' className={`fs-6 text-decoration-none col-6 m-0 rounded-0 ${confirm.current.headerClass}`} size='lg' onClick={yesClick}>
          {t('common.yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
})
ConfirmModal.displayName = 'ConfirmModal'
export { ConfirmModal }
