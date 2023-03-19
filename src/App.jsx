import React, { Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ManifestService } from '@dhruv-techapps/core-services'
import Header from './app/header'
import Footer from './app/footer'
import Configs from './app/configs/configs'
import { ToastHandler, ErrorAlert, DataList, Loading } from './components'
import { AdsBlockerModal, BlogModal, ConfirmModal, ExtensionNotFound } from './modal'
import { ModeProvider, ThemeProvider } from './_providers'
import { APP_NAME, NO_EXTENSION_ERROR } from './constants'

function App() {
  const toastRef = useRef()
  const blogRef = useRef()
  const confirmRef = useRef()
  const adsBlockerRef = useRef()
  const extensionNotFoundRef = useRef()
  const [loading, setLoading] = useState()
  const [manifest, setManifest] = useState({})
  const [error, setError] = useState()

  useEffect(() => {
    if (chrome.runtime) {
      setLoading(true)
      ManifestService.values(window.EXTENSION_ID, ['name', 'version'])
        .then(setManifest)
        .catch(_error => {
          if (NO_EXTENSION_ERROR.includes(_error.message)) {
            setTimeout(() => {
              extensionNotFoundRef.current.show()
            }, 1000)
          }
          setError(_error)
        })
        .finally(() => setLoading(false))
    }
  }, [])

  useEffect(() => {
    if (/(DEV|BETA)/.test(process.env.REACT_APP_VARIANT)) {
      window.document.title = `${APP_NAME} [${process.env.REACT_APP_VARIANT}]`
    } else {
      window.document.title = APP_NAME
    }
  }, [])

  return (
    <Router>
      <ThemeProvider>
        <ModeProvider>
          <div>
            <Suspense fallback='loading'>
              <Header error={error} confirmRef={confirmRef} />
              {loading && <Loading />}
              <ErrorAlert error={error} />
              <Configs toastRef={toastRef} blogRef={blogRef} confirmRef={confirmRef} />
              <Footer version={manifest.version} />
              <ToastHandler ref={toastRef} />
              <ConfirmModal ref={confirmRef} />
              <BlogModal ref={blogRef} />
              <ExtensionNotFound ref={extensionNotFoundRef} version={manifest.version} />
              <AdsBlockerModal ref={adsBlockerRef} version={manifest.version} />
            </Suspense>
            <DataList />
          </div>
        </ModeProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
