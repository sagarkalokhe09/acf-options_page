import React, { useEffect, useState, useContext } from 'react'
import { Service, StorageService } from '@dhruv-techapps/core-services'
import { Button, Form, Image } from 'react-bootstrap'
import { LOCAL_STORAGE_KEY, RESPONSE_CODE, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import { ThemeContext } from '../../_providers'

import GoogleSignInLight from '../../assets/btn_google_signin_light_normal_web.png'
import GoogleSignInDark from '../../assets/btn_google_signin_dark_normal_web.png'

function SettingGoogleSheets() {
  const { theme } = useContext(ThemeContext)
  const [google, setGoogle] = useState()

  useEffect(() => {
    if (chrome.runtime) {
      StorageService.get(window.EXTENSION_ID, LOCAL_STORAGE_KEY.GOOGLE)
        .then(({ google: result }) => {
          if (result) {
            setGoogle(result)
          }
        })
        .catch(Logger.error)
    }
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

  if (google) {
    return (
      <div className='w-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <Form.Label className='mx-3' htmlFor='discord'>
            <b className='text-muted d-block mb-2'>Google Sheets</b>
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
    <div className='d-flex flex-column align-items-start'>
      <b className='mx-3 text-muted'>Connect with Google Sheets</b>
      <Button variant='link' onClick={connect}>
        <img src={theme === 'light' ? GoogleSignInLight : GoogleSignInDark} alt='Logo' />
      </Button>
    </div>
  )
}

SettingGoogleSheets.displayName = 'SettingGoogleSheets'
SettingGoogleSheets.propTypes = {}
export { SettingGoogleSheets }
