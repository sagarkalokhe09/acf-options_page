import React, { useEffect, useRef } from 'react'
import './App.scss'
import Header from './app/header'
import Footer from './app/footer'
import Configs from './app/main/configs'
import ToastHandler from './app/components/ToastHandler'
import { Container } from 'react-bootstrap'

import { NotificationsService } from '@dhruv-techapps/core-common'

function App () {
  const toastRef = useRef()

  useEffect(() => {
    NotificationsService.notify({ title: 'Load', message: 'page loaded successfully' })
  }, [])

  return <>
    <Header />
    <main>
      <Container>
        <Configs toastRef={toastRef} />
      </Container>
      <ToastHandler ref={toastRef} />
    </main>
    <Footer />
  </>
}

export default App
