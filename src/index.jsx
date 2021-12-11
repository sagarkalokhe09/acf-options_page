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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

/*
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./firebase-messaging-sw.js')
    .catch(({ message }) => {
      GTAG.exception({ description: message, fatal: true })
    })
}
*/
