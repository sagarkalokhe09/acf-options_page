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
  const [version, setVersion] = useState('2.0.0')

  useEffect(() => {
    ManifestService.getItem('version').then(setVersion).catch(error => {
      if (error.message === 'Could not establish connection. Receiving end does not exist.') {
        // TODO remove before publishing
        // window.location.href = 'https://getautoclicker.com/'
      }
    })
  }, [])

  return <>{version && <Container>
    <Header />
    <main>
      <Configs toastRef={toastRef} />
    </main>
    <Footer version={version} />
    <ToastHandler ref={toastRef} />
  </Container>}</>
}

export default App
