import React, { useEffect, useState } from 'react'
import { Service, StorageService } from '@dhruv-techapps/core-services'
import { Button, Form, Image } from 'react-bootstrap'
import { LOCAL_STORAGE_KEY, RESPONSE_CODE, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common'
import { FileSpreadsheet } from '../../util'

function SettingGoogleSheets() {
  const [google, setGoogle] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    StorageService.get(window.EXTENSION_ID, LOCAL_STORAGE_KEY.GOOGLE)
      .then(({ google: result }) => {
        if (result) {
          setGoogle(result)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const connect = async () => {
    const response = await Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.GOOGLE_SHEETS, login: true })
    if (response !== RESPONSE_CODE.ERROR) {
      setGoogle(response)
    }
  }

  const remove = async () => {
    const response = await Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.GOOGLE_SHEETS, remove: true })
    if (response !== RESPONSE_CODE.ERROR) {
      setGoogle()
    }
  }

  if (loading) {
    return null
  }

  if (google) {
    return (
      <div className='w-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 mt-2 me-auto' htmlFor='discord'>
            <div className='fw-bold mb-2'>Google Sheets</div>
            <Image alt={google.name} className='me-2' title={google.name} src={google.picture} roundedCircle width='30' height='30' />
            {google.name}
            <Button variant='link' onClick={remove}>
              (remove)
            </Button>
          </Form.Label>
        </div>
      </div>
    )
  }

  return (
    <Button variant='link' onClick={connect} className='btn btn-link text-muted d-flex justify-content-between w-100'>
      <div>
        <FileSpreadsheet width='24' height='24' className='me-2' />
        Connect with Google Sheets
      </div>
    </Button>
  )
}

SettingGoogleSheets.displayName = 'SettingGoogleSheets'
SettingGoogleSheets.propTypes = {}
export { SettingGoogleSheets }
