import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Image, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { BROWSER, StorageService } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { GTAG, GearFill, Moon, Sun } from '../util'
import { SettingsModal } from '../modal'
import { AuthContext } from '../_providers/AuthProvider'
import { auth } from '../firebase'

const Header = ({ toggleTheme, theme }) => {
  const [showSettings, setShowSettings] = useState(false)
  const user = useContext(AuthContext)
  const handleClose = () => {
    setShowSettings(false)
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Close' })
  }

  const openSettings = () => {
    setShowSettings(true)
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Open' })
  }

  const login = () => {
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Login' })
    window.open('popup.html', 'name', 'height=800,width=475')
  }

  const logout = () => {
    auth.signOut().then(() => {
      StorageService.removeItem(LOCAL_STORAGE_KEY.DISCORD)
      window.location.reload()
    })
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
            title='Auto click Auto Fill logo'
            onError={e => {
              e.currentTarget.src = 'https://getautoclicker.com/favicons/favicon32.png'
            }}
          />
          <h1>{process.env.REACT_APP_NAME}</h1>
        </Navbar.Brand>
        <Nav className='mr-auto' />
        <Form inline>
          <button type='button' onClick={toggleTheme}>
            {theme !== 'light' ? <Sun width='24' height='24' /> : <Moon width='24' height='24' />}
          </button>
          <button type='button' onClick={openSettings} className='ml-3'>
            <GearFill width='24' height='24' />
          </button>
          {user ? (
            <>
              <NavDropdown
                title={user.photoURL ? <Image alt={user.displayName} title={user.displayName} src={user.photoURL} roundedCircle width='30' height='30' /> : user.displayName}
                id='basic-nav-dropdown'
                alignRight>
                <NavDropdown.Item href='#logout' title='logout' onClick={logout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <button type='button' onClick={login}>
              Login
            </button>
          )}
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
