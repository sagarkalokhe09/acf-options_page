import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import './index.scss'
import { GTAG, disableContextMenu } from './util'
import App from './App'
import './i18n'

window.react_env = process.env

GTAG.pageview({ title: 'Home', url: window.location.href, path: '/' })

ReactDOM.render(<App />, document.getElementById('root'))

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

serviceWorker.unregister()
