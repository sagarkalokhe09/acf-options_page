import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'react-bootstrap'

const SettingMessage = forwardRef((_, ref) => {
  const [message, setMessage] = useState()

  useImperativeHandle(ref, () => ({
    showMessage(_message) {
      setMessage(_message)
      setTimeout(setMessage, 1500)
    }
  }))

  if (!message) {
    return null
  }

  return (
    <Modal.Footer>
      <span className='text-success'>{message}</span>
    </Modal.Footer>
  )
})

SettingMessage.displayName = 'SettingMessage'
export { SettingMessage }
