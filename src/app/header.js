import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Form, Badge } from 'react-bootstrap'
import { ReactComponent as GearFill } from 'bootstrap-icons/icons/gear-fill.svg'
import SettingsModal from './settings/settings.modal'

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
        src='./icon32.png'
        width='30'
        height='30'
        className='d-inline-block align-top mr-2'
        alt='Auto click Auto Fill logo'
      />
      {process.env.REACT_APP_NAME}
      {process.env.REACT_APP_VARIANT && <Badge variant="danger ml-2 font-weight-light" >{process.env.REACT_APP_VARIANT}</Badge>}
    </Navbar.Brand>
    <Navbar.Toggle aria-controls='basic-navbar-nav' />
    <Navbar.Collapse id='basic-navbar-nav'>
      <Nav className="mr-auto">
      </Nav>
      <Form inline>
        <Nav className="mr-2">
          <Nav.Link href={process.env.REACT_APP_DOCS + 'getting-started'} target='_blank'>Documentation</Nav.Link>
          <Nav.Link href={process.env.REACT_APP_BLOG} target='_blank'>Blog</Nav.Link>
          <Nav.Link href={process.env.REACT_APP_EXAMPLES} target='_blank'>Examples</Nav.Link>
        </Nav>
        <GearFill width='24' height='24' onClick={() => setShowSettings(true)} />
        <SettingsModal show={showSettings} handleClose={handleClose} />
      </Form>
    </Navbar.Collapse>
  </Navbar>
}
Header.propTypes = {}
export default Header
