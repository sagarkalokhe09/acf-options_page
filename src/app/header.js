import React, { useState } from 'react'
import { Navbar, Nav, Form } from 'react-bootstrap'
import { ReactComponent as GearFill } from 'bootstrap-icons/icons/gear-fill.svg'
import SettingsModal from './settings/SettingsModal'

const Header = () => {
  const [showSettings, setShowSettings] = useState(false)
  const handleClose = () => {
    setShowSettings(false)
  }

  return <Navbar expand='lg' sticky='top' bg='light'>
    <Navbar.Brand href='#home'>
      <img
        src='./logo64.png'
        width='30'
        height='30'
        className='d-inline-block align-top'
        alt='Auto click Auto Fill logo'
      />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls='basic-navbar-nav' />
    <Navbar.Collapse id='basic-navbar-nav'>
      <Nav className='mr-auto'>
        <Nav.Link href='#' active>Home</Nav.Link>
        <Nav.Link href='https://getautoclicker.com/docs/getting-started' target='_blank'>Documentaion</Nav.Link>
        <Nav.Link href='https://getautoclicker.com/blog' target='_blank'>Blog</Nav.Link>
        <Nav.Link href='https://getautoclicker.com/examples/dhruv-techapps.github.io' target='_blank'>Examples</Nav.Link>
      </Nav>
      <Form inline>
        <GearFill width='24' height='24' onClick={() => setShowSettings(true)} />
        <SettingsModal show={showSettings} handleClose={handleClose} />
      </Form>
    </Navbar.Collapse>
  </Navbar>
}
export default Header
