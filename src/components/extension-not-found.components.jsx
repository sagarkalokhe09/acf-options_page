import React from 'react'
import { Button } from 'react-bootstrap'
import { BROWSER } from '@dhruv-techapps/core-common'
import { Trans, useTranslation } from 'react-i18next'

export function ExtensionNotFound() {
  const { t } = useTranslation()

  const downloadClick = () => {
    const webStore = process.env[`REACT_APP_${BROWSER}_WEB_STORE`]
    const extensionId = process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]
    window.open(`${webStore}${extensionId}`)
  }

  return (
    <div>
      <h5 className='text-center mb-3'>{t('modal.extensionNotFound.title')}</h5>
      <p className='mb-0'>
        <Trans i18nKey='modal.extensionNotFound.subTitle' components={{ b: <span className='text-info' />, Badge: <span className='text-info' /> }} values={process.env} />.{' '}
        {t('modal.extensionNotFound.hint')}
      </p>
      <div className='d-flex justify-content-center mt-5'>
        <Button variant='outline-primary' className='fs-6 text-decoration-none col-3 m-0 rounded-0' size='lg' onClick={downloadClick}>
          <strong>{t('common.download')}</strong>
        </Button>
      </div>
    </div>
  )
}
