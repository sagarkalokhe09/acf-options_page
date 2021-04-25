import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Nav, Navbar } from 'react-bootstrap'
import { BROWSER } from '@dhruv-techapps/core-common'
import { GTAG, GearFill, Moon, Sun } from '../util'
import { SettingsModal } from '../modal'

const Header = ({ toggleTheme, theme }) => {
  const [showSettings, setShowSettings] = useState(false)

  const handleClose = () => {
    setShowSettings(false)
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Close' })
  }

  const openSettings = () => {
    setShowSettings(true)
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Open' })
  }

  return (
    <header>
      <Navbar expand='lg'>
        <Navbar.Brand>
          <img
            src={`chrome-extension://${process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]}/assets/icons/icon32.png`}
            width='32'
            height='32'
            className='d-inline-block align-top mr-2'
            alt='Auto click Auto Fill logo'
            onError={e => {
              e.currentTarget.src = 'https://getautoclicker.com/favicons/favicon32.png'
            }}
          />
          {process.env.REACT_APP_NAME}
        </Navbar.Brand>
        <Nav className='mr-auto' />
        <Form inline>
          <button type='button' onClick={toggleTheme}>
            {theme !== 'light' ? <Sun width='24' height='24' /> : <Moon width='24' height='24' />}
          </button>
          <button type='button' onClick={openSettings} className='ml-3'>
            <GearFill width='24' height='24' />
          </button>
          <SettingsModal show={showSettings} handleClose={handleClose} />
        </Form>
      </Navbar>
    </header>
  )
}
Header.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired
}
export default Header
