import React from 'react'
import ReactDOM from 'react-dom'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import './index.scss'
import { GTAG, disableContextMenu } from './util'
import App from './App'
import './i18n'
import { BROWSER } from './_helpers'
import { msalConfig } from './authConfig'

window.EXTENSION_ID = process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]

GTAG.pageview({ title: 'Home', url: window.location.href, path: '/' })

/**
 * Initialize a PublicClientApplication instance which is provided to the MsalProvider component
 * We recommend initializing this outside of your root component to ensure it is not re-initialized on re-renders
 */
const msalInstance = new PublicClientApplication(msalConfig)

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>,
  document.getElementById('root')
)

if (process.env.NODE_ENV !== 'development') {
  disableContextMenu()
}
window.onerror = function (message) {
  GTAG.exception({ description: message, fatal: true })
}

// eslint-disable-next-line no-console
console.error = (function () {
  const { error } = console
  return function (...args) {
    error.apply(console, args)
    GTAG.exception({ description: args[0], fatal: true })
  }
})()
