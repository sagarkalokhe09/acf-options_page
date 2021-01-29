import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import Header from './app/header'
import Footer from './app/footer'
import Configs from './app/main/configs'
import ToastHandler from './app/components/ToastHandler'
import { Alert, Container } from 'react-bootstrap'
import { IS_MOBILE, ManifestService } from '@dhruv-techapps/core-common'
import ExtensionNotFoundModel from './app/extension-not-found.modal'
import GoogleAds from './app/components/GoogleAds'
import GTAG from './app/gtag'
import messaging from './firebase'

function App () {
  const toastRef = useRef()
  const extensionNotFoundRef = useRef()
  const [manifest, setManifest] = useState({})
  const [token, setToken] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    ManifestService.values(['name', 'version']).then(setManifest).catch(error => {
      if (error.message === 'Could not establish connection. Receiving end does not exist.') {
        GTAG.exception({ description: error.message, fatal: true })
        extensionNotFoundRef.current.show()
      }
    })
    if (IS_MOBILE) {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          const vapidKey = process.env.REACT_APP_VAPID_KEY
          messaging.getToken({ vapidKey }).then((currentToken) => {
            if (currentToken) {
              setToken(currentToken)
            } else {
              setError('No registration token available. Request permission to generate one.')
            }
          }).catch(setError)
        }
      })
    }
  }, [])

  return <Container>
    <Header/>
    <main>
      {token && <Alert variant="primary" className="font-weight-light mb-2">{token}</Alert >}
      {error && <Alert variant="danger" className="font-weight-light mb-2">{error}</Alert >}
      <Configs toastRef={toastRef} />
    </main>
    <Footer version={manifest.version || ''}/>
    <ToastHandler ref={toastRef} />
    <ExtensionNotFoundModel ref={extensionNotFoundRef} />
    <GoogleAds client={process.env.REACT_APP_GOOGLE_ADS_CLIENT} slot={process.env.REACT_APP_GOOGLE_ADS_SLOT} format="auto"/>
  </Container>
}

export default App
