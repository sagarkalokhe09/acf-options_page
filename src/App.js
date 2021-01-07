import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import Header from './app/header'
import Footer from './app/footer'
import Configs from './app/main/configs'
import ToastHandler from './app/components/ToastHandler'
import { Container } from 'react-bootstrap'
import { ManifestService } from '@dhruv-techapps/core-common'
import ExtensionNotFoundModel from './app/extension-not-found.modal'
import GoogleAds from './app/components/GoogleAds'
import GTAG from './app/gtag'

function App () {
  const toastRef = useRef()
  const extensionNotFoundRef = useRef()
  const [manifest, setManifest] = useState({})

  useEffect(() => {
    ManifestService.values(['name', 'version']).then(setManifest).catch(error => {
      if (error.message === 'Could not establish connection. Receiving end does not exist.') {
        GTAG.exception({ description: error.message, fatal: true })
        extensionNotFoundRef.current.show()
      }
    })
  }, [])

  return <Container>
    <Header/>
    <main>
      <Configs toastRef={toastRef} />
    </main>
    <Footer version={manifest.version || ''}/>
    <ToastHandler ref={toastRef} />
    <ExtensionNotFoundModel ref={extensionNotFoundRef} />
    <GoogleAds client={process.env.REACT_APP_GOOGLE_ADS_CLIENT} slot={process.env.REACT_APP_GOOGLE_ADS_SLOT} format="auto"/>
  </Container>
}

export default App
