import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

const ConfirmModal = forwardRef((props, ref) => {
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
      <Modal.Body className='mx-auto text-center'>
        <h4 className='my-3'>{confirm.current.title || 'Confirm'}</h4>
        {confirm.current.message}
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button variant='outline-secondary' className='px-3 mr-3' size='md' onClick={noClick}>
          No
        </Button>
        <Button variant='outline-primary' className='px-3' size='md' onClick={yesClick}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  )
})
export { ConfirmModal }
