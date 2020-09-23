import React, { useState, forwardRef, useImperativeHandle } from 'react'
import './ToastHandler.scss'
import { Toast } from 'react-bootstrap'

const ToastHandler = forwardRef((props, ref) => {
  const [list, setList] = useState([])

  const close = (selected) => {
    setList(list => list.map((toast, index) => {
      if (index === selected) {
        return { ...toast[selected], show: false }
      }
      return toast
    }))
  }

  useImperativeHandle(ref, () => ({
    push (toast) {
      setList([toast, ...list])
    }
  }))

  return <div className='toast-handler'>
    {list.map(({ body, header, bodyClass, headerClass, delay = 50000, autohide = false, show = true }, index) => {
      return <Toast key={index} onClose={() => close(index)} show={show} delay={delay} autohide={autohide}>
        <Toast.Header className={headerClass}>{header}</Toast.Header>
        <Toast.Body className={bodyClass}>{body}</Toast.Body>
      </Toast>
    })}
  </div>
})
ToastHandler.displayName = 'ToastHandler'
export default ToastHandler
