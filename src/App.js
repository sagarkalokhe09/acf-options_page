import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import Header from './app/header'
import Footer from './app/footer'
import Configs from './app/main/configs'
import ToastHandler from './app/components/ToastHandler'
import { Container } from 'react-bootstrap'
import { ManifestService } from '@dhruv-techapps/core-common'

function App () {
  const toastRef = useRef()
  const [manifest, setManifest] = useState()

  useEffect(() => {
    ManifestService.values(['name', 'version']).then(setManifest).catch(error => {
      if (error.message === 'Could not establish connection. Receiving end does not exist.') {
        // TODO remove before publishing
        // window.location.href = 'https://getautoclicker.com/'
      }
    })
  }, [])

  return <>{manifest && <Container>
    <Header name={manifest.name}/>
    <main>
      <Configs toastRef={toastRef} />
    </main>
    <Footer version={manifest.version} />
    <ToastHandler ref={toastRef} />
  </Container>}</>
}

export default App
