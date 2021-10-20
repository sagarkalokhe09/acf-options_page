import React, { useContext, useEffect, useState } from 'react'
import { Container, Image, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { BROWSER } from '@dhruv-techapps/core-common'
import { StorageService } from '@dhruv-techapps/core-services'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { useTranslation } from 'react-i18next'
import { GTAG, GearFill, Moon, Sun } from '../util'
import { SettingsModal } from '../modal'
import { AuthContext } from '../_providers/AuthProvider'
import { auth } from '../firebase'
import { ThemeContext } from '../_providers/ThemeProvider'

const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext)
  const [showSettings, setShowSettings] = useState(false)
  const [languages, setLanguages] = useState([])
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setLanguages(process.env.REACT_APP_LANGUAGES.split(','))
  }, [])
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

  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
  }

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <header>
      <nav className={`border-bottom navbar navbar-expand-lg navbar-${theme} py-0 bg-${theme}`}>
        <Container fluid className='px-5 justify-content-center justify-content-md-between'>
          <Navbar.Brand>
            <img
              src={`chrome-extension://${process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]}/assets/icons/icon32.png`}
              width='32'
              height='32'
              className='d-inline-block align-top me-2'
              alt='Auto click Auto Fill logo'
              title='Auto click Auto Fill logo'
              onError={e => {
                e.currentTarget.src = 'https://getautoclicker.com/favicons/favicon32.png'
              }}
            />
            <h1 className='h4 d-inline-flex ms-2 my-0 fw-normal'>{process.env.REACT_APP_NAME}</h1>
          </Navbar.Brand>
          <Navbar className='p-0'>
            <Nav className='me-auto' />
            <Nav>
              <Nav.Link onClick={toggleTheme} className='px-4 py-3'>
                {theme !== 'light' ? <Sun width='24' height='24' title={t('header.theme.dark')} /> : <Moon width='24' height='24' title={t('header.theme.light')} />}
              </Nav.Link>
              <Nav.Link onClick={openSettings} className='px-4 py-3'>
                <GearFill width='24' height='24' title={t('header.settings')} />
              </Nav.Link>
              {user ? (
                <>
                  <NavDropdown
                    title={user.photoURL ? <Image alt={user.displayName} title={user.displayName} src={user.photoURL} roundedCircle width='30' height='30' /> : user.displayName}
                    id='user-nav-dropdown'
                    className='px-4 py-3'>
                    <NavDropdown.Item href='#logout' title='logout' onClick={logout}>
                      {t('header.logout')}
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link onClick={login} className='px-4 py-3 fw-bolder'>
                  {t('header.login')}
                </Nav.Link>
              )}
              <NavDropdown title={i18n.language} id='language-nav-dropdown' align='end' className='text-uppercase px-4 py-2 fw-bolder'>
                {languages.map((language, index) => (
                  <NavDropdown.Item key={index} title={language} onClick={() => changeLanguage(language)} className='text-secondary'>
                    {t(`language.${language}`)}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <SettingsModal show={showSettings} handleClose={handleClose} />
            </Nav>
          </Navbar>
        </Container>
      </nav>
    </header>
  )
}
export default Header
