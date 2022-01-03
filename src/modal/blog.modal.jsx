import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { GTAG } from '../util'

const BlogModal = forwardRef((_, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [data, setData] = useState()
  const [version, setVersion] = useState()

  useEffect(async () => {}, [])

  useImperativeHandle(ref, () => ({
    async showBlog(v) {
      setVersion(v)
      const response = await fetch(`https://blog.getautoclicker.com/${v}/`)
      if (response.status === 200) {
        const html = await response.text()
        const div = document.createElement('div')
        div.innerHTML = html
        setData(div.querySelector('main.content').innerHTML)
        setShow(true)
        GTAG.modalview({ title: 'Show Blog', url: window.location.href, path: '/blog' })
      }
    }
  }))

  const handleClose = () => {
    setShow(false)
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose} scrollable>
      <Modal.Header>
        <Modal.Title as='h6'>Version {version}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }} dangerouslySetInnerHTML={{ __html: data }} />
      <Modal.Footer className='justify-content-end'>
        <Button type='button' variant='outline-primary px-5' onClick={handleClose}>
          {t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

BlogModal.displayName = 'BlogModal'
const memo = React.memo(BlogModal)
export { memo as BlogModal }
