import React from 'react'
import { Button } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { CHROME_WEB_STORE, EDGE_WEB_STORE } from '../constants'
import { BROWSER } from '../_helpers'

export function ExtensionNotFound() {
  const { t } = useTranslation()

  const downloadClick = () => {
    const webStore = BROWSER === 'EDGE' ? EDGE_WEB_STORE : CHROME_WEB_STORE
    const extensionId = process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]
    window.open(`${webStore}${extensionId}`)
  }

  const refresh = e => {
    e.preventDefault()
    window.location.reload()
  }

  return (
    <div>
      <h5 className='text-center mb-3'>{t('modal.extensionNotFound.title')}</h5>
      <p className='mb-0'>
        <Trans i18nKey='modal.extensionNotFound.subTitle' components={{ b: <span className='text-info' />, Badge: <span className='text-info' /> }} values={process.env} />.{' '}
        {t('modal.extensionNotFound.hint')}
      </p>
      <p className='mt-2'>
        With{' '}
        <a href='https://developer.chrome.com/docs/extensions/mv3/intro/' target='_blank' rel='noreferrer'>
          MV3
        </a>{' '}
        version extension gets inactive and our configuration page unable to communicate with same. Please do refresh once and activate extension again if you already have extension installed.
      </p>
      <div className='d-flex justify-content-center mt-5'>
        <Button variant='outline-primary' className='fs-6 text-decoration-none col-3 m-0 rounded-0 me-5' size='lg' onClick={refresh}>
          Refresh
        </Button>
        <Button variant='outline-primary' className='fs-6 text-decoration-none col-3 m-0 rounded-0' size='lg' onClick={downloadClick}>
          {t('common.download')}
        </Button>
      </div>
    </div>
  )
}
