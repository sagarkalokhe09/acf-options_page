import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { disableContextMenu } from './app/util/helper'
import { GAService } from '@dhruv-techapps/core-common'

window.react_env = process.env

ReactDOM.render(<App />, document.getElementById('root'))

if (process.env.NODE_ENV !== 'development') {
  disableContextMenu()
}

console.error = (function () {
  const { error } = console
  return function (...args) {
    GAService.error({ name: 'OptionsPageError', stack: args[0] })
    error.apply(console, args)
  }
}())

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
