import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { CHROME_WEB_STORE, EDGE_WEB_STORE } from '../constants'
import { dataLayerModel } from '../util/data-layer'
import { BROWSER } from '../_helpers'

const ExtensionNotFound = forwardRef(({ version }, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState()

  useEffect(() => {
    if (!chrome.runtime) {
      setShow(true)
    }
  }, [chrome.runtime])

  useEffect(() => {
    if (!version) {
      setShow(true)
    }
  }, [version])

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true)
    }
  }))

  const downloadClick = () => {
    const webStore = BROWSER === 'EDGE' ? EDGE_WEB_STORE : CHROME_WEB_STORE
    const extensionId = process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]
    window.open(`${webStore}${extensionId}`)
  }

  const refresh = e => {
    e.preventDefault()
    window.location.reload()
  }

  const onHide = () => {
    dataLayerModel('extension-not-found', 'close')
    setShow(false)
  }

  return (
    <Modal show={show} size='lg' centered backdrop='static' keyboard={false} onShow={() => dataLayerModel('extension-not-found', 'open')} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.extensionNotFound.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>
        <p className='mb-0'>
          <Trans i18nKey='modal.extensionNotFound.subTitle' components={{ b: <b />, Badge: <span className='text-info' /> }} values={process.env} />. {t('modal.extensionNotFound.hint')}
        </p>
        <p className='mt-5'>
          With{' '}
          <a href='https://developer.chrome.com/docs/extensions/mv3/intro/' target='_blank' rel='noreferrer'>
            MV3
          </a>{' '}
          version extension gets inactive and our configuration page unable to communicate with same. Please do refresh once and activate extension again if you already have extension installed.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' className='me-3' onClick={refresh}>
          Refresh
        </Button>
        <Button variant='primary' onClick={downloadClick}>
          {t('common.download')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

ExtensionNotFound.displayName = 'ExtensionNotFound'
ExtensionNotFound.defaultProps = {
  version: ''
}
ExtensionNotFound.propTypes = {
  version: PropTypes.string
}
export { ExtensionNotFound }
