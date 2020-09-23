import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Form } from 'react-bootstrap'
import { ReactComponent as GearFill } from 'bootstrap-icons/icons/gear-fill.svg'
import SettingsModal from './settings/SettingsModal'

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
  }

  const className = `${scroll ? 'shadow' : ''}`
  return <Navbar expand='lg' variant="light" sticky='top' className={className}>
    <Navbar.Brand>
      <img
        src='./logo64.png'
        width='30'
        height='30'
        className='d-inline-block align-top mr-2'
        alt='Auto click Auto Fill logo'
      />
      Auto Clicker - AutoFill
    </Navbar.Brand>
    <Navbar.Toggle aria-controls='basic-navbar-nav' />
    <Navbar.Collapse id='basic-navbar-nav'>
      <Nav className="mr-auto">
      </Nav>
      <Form inline>
        <Nav className="mr-2">
          <Nav.Link href='https://getautoclicker.com/docs/getting-started' target='_blank'>Documentaion</Nav.Link>
          <Nav.Link href='https://getautoclicker.com/blog' target='_blank'>Blog</Nav.Link>
          <Nav.Link href='https://getautoclicker.com/examples/dhruv-techapps.github.io' target='_blank'>Examples</Nav.Link>
        </Nav>
        <GearFill width='24' height='24' onClick={() => setShowSettings(true)} />
        <SettingsModal show={showSettings} handleClose={handleClose} />
      </Form>
    </Navbar.Collapse>
  </Navbar>
}
export default Header
