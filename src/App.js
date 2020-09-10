import React, { useRef } from 'react'
import './App.scss'
import Header from './app/header'
import Footer from './app/footer'
import Configs from './app/main/configs'
import ToastHandler from './app/components/ToastHandler'
import { Container } from 'react-bootstrap'

function App () {
  const toastRef = useRef()

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
