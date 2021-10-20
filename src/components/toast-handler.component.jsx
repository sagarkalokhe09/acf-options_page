import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Toast } from 'react-bootstrap'

export const ToastHandler = forwardRef((props, ref) => {
  const [list, setList] = useState([])

  const close = selected => {
    setList(prevList =>
      prevList.map((toast, index) => {
        if (index === selected) {
          return { ...toast[selected], show: false }
        }
        return toast
      })
    )
  }

  useImperativeHandle(ref, () => ({
    push(toast) {
      setList([toast, ...list])
    }
  }))

  return (
    <div className='toast-container position-fixed bottom-0 start-0 p-3'>
      {list.map(({ body, toastClass, bodyClass, delay = 5000, autohide = true, show = true, onClose }, index) => (
        <Toast
          key={index}
          onClose={() => {
            close(index)
            if (onClose) onClose(index)
          }}
          show={show}
          delay={delay}
          className={toastClass}
          autohide={autohide}>
          <Toast.Header className={bodyClass}>{body}</Toast.Header>
        </Toast>
      ))}
    </div>
  )
})
ToastHandler.displayName = 'ToastHandler'
