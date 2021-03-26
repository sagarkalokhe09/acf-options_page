import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Form } from 'react-bootstrap'
import { ReactComponent as GearFill } from 'bootstrap-icons/icons/gear-fill.svg'
import SettingsModal from './settings/settings.modal'
import GTAG from './gtag'
import { BROWSER } from '@dhruv-techapps/core-common'

const Header = () => {
  const [showSettings, setShowSettings] = useState(false)
  const [scroll, setScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.pageYOffset !== 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleClose = () => {
    setShowSettings(false)
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Close' })
  }

  const openSettings = () => {
    setShowSettings(true)
    GTAG.event({ category: 'Settings', action: 'Click', label: 'Open' })
  }

  const className = `${scroll ? 'shadow' : ''}`
  return <Navbar expand='lg' variant="light" sticky='top' className={className}>
    <Navbar.Brand>
      <img
        src={`chrome-extension://${process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]}/assets/icons/icon32.png`}
        width='32'
        height='32'
        className='d-inline-block align-top mr-2'
        alt='Auto click Auto Fill logo'
        onError={(e) => (e.currentTarget.src = 'https://getautoclicker.com/favicons/favicon32.png')}
      />
      {process.env.REACT_APP_NAME}
    </Navbar.Brand>
    <Navbar.Toggle aria-controls='basic-navbar-nav' />
    <Navbar.Collapse id='basic-navbar-nav'>
      <Nav className="mr-auto">
      </Nav>
      <Form inline>
        <GearFill width='24' height='24' onClick={openSettings} />
        <SettingsModal show={showSettings} handleClose={handleClose} />
      </Form>
    </Navbar.Collapse>
  </Navbar>
}
Header.propTypes = {}
export default Header
