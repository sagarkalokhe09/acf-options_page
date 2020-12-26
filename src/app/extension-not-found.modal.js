import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'

const ExtensionNotFoundModel = forwardRef((_, ref) => {
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    show () {
      setShow(true)
    }
  }))

  const cancelClick = () => {
    setShow(false)
  }

  const downloadClick = () => {
    setShow(false)
  }

  return <Modal show={show} centered backdrop='static' keyboard={false}>
    <Modal.Header closeButton>
      <Modal.Title>Extension Not Found</Modal.Title>
    </Modal.Header>
    <Modal.Body className='mx-auto text-center'>
      <p>this is configuration page for <b>{process.env.REACT_APP_NAME}</b> {process.env.REACT_APP_VARIANT && <Badge variant="danger ml-2 font-weight-light" >{process.env.REACT_APP_VARIANT}</Badge>} extension.</p>
      <p>You need to download extension first in order to make use of this</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant='secondary' className='px-3 mr-3' size='md' onClick={cancelClick}>Cancel</Button>
      <Button variant='primary' className='px-3' size='md' onClick={downloadClick}>Download</Button>
    </Modal.Footer>
  </Modal>
})

ExtensionNotFoundModel.displayName = 'ExtensionNotFoundModel'
export default ExtensionNotFoundModel
