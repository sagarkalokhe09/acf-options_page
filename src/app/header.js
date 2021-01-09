import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Form, Badge } from 'react-bootstrap'
import { ReactComponent as GearFill } from 'bootstrap-icons/icons/gear-fill.svg'
import SettingsModal from './settings/settings.modal'
import GTAG from './gtag'

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
          <Nav.Link href={process.env.REACT_APP_DOCS + 'getting-started'} target='_blank' onClick={() => { GTAG.event({ category: 'Navbar', action: 'Click', label: 'Docs' }) }}>Docs</Nav.Link>
          <Nav.Link href={process.env.REACT_APP_BLOG} target='_blank' onClick={() => { GTAG.event({ category: 'Navbar', action: 'Click', label: 'Blog' }) }}>Blog</Nav.Link>
          <Nav.Link href={process.env.REACT_APP_EXAMPLES} target='_blank' onClick={() => { GTAG.event({ category: 'Navbar', action: 'Click', label: 'Examples' }) }}>Examples</Nav.Link>
          <Nav.Link href={process.env.REACT_APP_DISCORD} target='_blank' onClick={() => { GTAG.event({ category: 'Navbar', action: 'Click', label: 'Discord' }) }}>Chat-on-Discord</Nav.Link>
        </Nav>
        <GearFill width='24' height='24' onClick={openSettings} />
        <SettingsModal show={showSettings} handleClose={handleClose} />
      </Form>
    </Navbar.Collapse>
  </Navbar>
}
Header.propTypes = {}
export default Header
