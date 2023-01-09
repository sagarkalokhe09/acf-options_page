import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useMsal } from '@azure/msal-react'
import { Logger } from '@dhruv-techapps/core-common'
import { GTAG, GearFill, Moon, Sun, ChatFill } from '../util'
import { SettingsModal } from '../modal'
import { ThemeContext } from '../_providers/ThemeProvider'
import { APP_LANGUAGES, APP_NAME, SOCIAL_LINKS } from '../constants'
import { loginRequest } from '../authConfig'

function Header({ error }) {
  const { theme, setTheme } = useContext(ThemeContext)
  const [showSettings, setShowSettings] = useState(false)
  const [languages, setLanguages] = useState([])
  const { t, i18n } = useTranslation()
  const { instance, accounts } = useMsal()
  useEffect(() => {
    setLanguages(APP_LANGUAGES)
  }, [])
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
    instance.loginRedirect(loginRequest).catch(e => {
      Logger.log(e)
    })
  }

  const logout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/'
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
              src='https://getautoclicker.com/favicons/favicon32.png'
              width='32'
              height='32'
              className='d-inline-block align-top me-2'
              alt='Auto click Auto Fill logo'
              title='Auto click Auto Fill logo'
              onError={e => {
                e.currentTarget.src = 'https://getautoclicker.com/favicons/favicon32.png'
              }}
            />
            <h1 className='h4 d-inline-flex ms-2 my-0 fw-normal'>{APP_NAME}</h1>
          </Navbar.Brand>
          <Navbar className='p-0'>
            <Nav className='me-auto' />
            <Nav>
              <Nav.Link target='_blank' href={SOCIAL_LINKS.GOOGLE_GROUP} className='px-4 py-3'>
                <ChatFill width='24' height='24' title={t('header.theme.dark')} />
              </Nav.Link>
              <Nav.Link onClick={toggleTheme} className='px-4 py-3'>
                {theme !== 'light' ? <Sun width='24' height='24' title={t('header.theme.dark')} /> : <Moon width='24' height='24' title={t('header.theme.light')} />}
              </Nav.Link>
              {!error.message && (
                <>
                  <Nav.Link onClick={openSettings} className='px-4 py-3'>
                    <GearFill width='24' height='24' title={t('header.settings')} />
                  </Nav.Link>
                  {accounts.length !== 0 ? (
                    <NavDropdown title={accounts[0].name} id='user-nav-dropdown' className='px-4 py-2'>
                      <NavDropdown.Item href='#logout' title='logout' onClick={logout}>
                        {t('header.logout')}
                      </NavDropdown.Item>
                    </NavDropdown>
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
                </>
              )}
              <SettingsModal show={showSettings} handleClose={handleClose} />
            </Nav>
          </Navbar>
        </Container>
      </nav>
    </header>
  )
}
Header.defaultProps = {
  error: {}
}
Header.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string })
}
export default Header
