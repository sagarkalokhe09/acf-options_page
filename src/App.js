import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import Header from './app/header'
import Footer from './app/footer'
import Configs from './app/main/configs'
import ToastHandler from './app/components/ToastHandler'
import { Container } from 'react-bootstrap'
import { ManifestService } from '@dhruv-techapps/core-common'
import { Error } from './app/components/Error'
import GoogleAds from './app/components/GoogleAds'

function App () {
  const toastRef = useRef()
  const [manifest, setManifest] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    ManifestService.values(['name', 'version']).then(setManifest).catch(error => {
      setError(error)
      if (error.message === 'Could not establish connection. Receiving end does not exist.') {
        window.location.href = 'https://getautoclicker.com/'
      }
    })
  }, [])

  try {
    return <Container>
      {error ? <Error error={error} className="mt-5"/> : manifest && <>
        <Header name={manifest.name}/>
        <main>
          <Configs toastRef={toastRef} />
        </main>
        <Footer version={manifest.version} />
        <ToastHandler ref={toastRef} />
      </>}
      <GoogleAds client="ca-pub-9512495707028343" slot="4304175895" format="auto"/>
    </Container>
  } catch (error) {
    console.error(',ers', error)
  }
}

export default App
