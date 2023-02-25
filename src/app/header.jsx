import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { GearFill, Moon, Sun, ChatFill } from '../util'
import { SettingsModal } from '../modal'
import { ThemeContext } from '../_providers/ThemeProvider'
import { APP_LANGUAGES, APP_NAME, SOCIAL_LINKS } from '../constants'
import { BackupDropdown } from '../components/backup.components'
import { dataLayerModel } from '../util/data-layer'

function Header({ confirmRef, error }) {
  const { theme, setTheme } = useContext(ThemeContext)

  const [showSettings, setShowSettings] = useState(false)
  const [languages, setLanguages] = useState([])
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setLanguages(APP_LANGUAGES)
  }, [])

  const handleClose = () => {
    dataLayerModel('settings', 'close')
    setShowSettings(false)
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  /* const login = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      Logger.log(e)
    })
  }

  const logout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/'
    })
  } */

  const changeLanguage = lng => {
    window.dataLayer.push({ event: 'language', conversionValue: lng })
    i18n.changeLanguage(lng)
  }

  const toggleTheme = () => {
    window.dataLayer.push({ event: 'theme', conversionValue: theme === 'light' ? 'dark' : 'light' })
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  let imageURL = 'https://getautoclicker.com/favicons/favicon32.png'
  let appName = APP_NAME
  if (/(DEV|BETA)/.test(process.env.REACT_APP_VARIANT)) {
    imageURL = `https://getautoclicker.com/favicons/${process.env.REACT_APP_VARIANT}/icon32.png`
    appName += ` [${process.env.REACT_APP_VARIANT}]`
  }

  return (
    <header>
      <nav className='border-bottom navbar navbar-expand-lg'>
        <Container fluid className='px-5 justify-content-center justify-content-md-between'>
          <Navbar.Brand>
            <img src={imageURL} width='32' height='32' className='d-inline-block align-top me-2' alt='Auto click Auto Fill logo' title='Auto click Auto Fill logo' />
            <h1 className='h4 d-inline-flex ms-2 my-0 fw-normal'>{appName}</h1>
          </Navbar.Brand>
          <Navbar className='p-0'>
            <Nav className='me-auto' />
            <Nav>
              <Nav.Link target='_blank' href={SOCIAL_LINKS.GOOGLE_GROUP} className='px-4 py-3'>
                <ChatFill width='24' height='24' title={t('header.google-group')} />
              </Nav.Link>
              <Nav.Link onClick={toggleTheme} className='px-4 py-3'>
                {theme !== 'light' ? <Sun width='24' height='24' title={t('header.theme.dark')} /> : <Moon width='24' height='24' title={t('header.theme.light')} />}
              </Nav.Link>

              {!error.message && (
                <>
                  <Nav.Link onClick={openSettings} className='px-4 py-3'>
                    <GearFill width='24' height='24' title={t('header.settings')} />
                  </Nav.Link>
                  <BackupDropdown confirmRef={confirmRef} />
                  {/* accounts.length !== 0 ? (
                    <NavDropdown title={accounts[0].name} id='user-nav-dropdown' className='px-2 py-2 fw-bolder'>
                      <NavDropdown.Item href='#logout' title='logout' onClick={logout}>
                        {t('header.logout')}
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <Nav.Link onClick={login} className='px-2 py-3 fw-bolder'>
                      {t('header.login')}
                    </Nav.Link>
                  ) */}
                  <NavDropdown title={i18n.language} id='language-nav-dropdown' align='end' className='text-uppercase px-2 py-2 fw-bolder'>
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
  confirmRef: PropTypes.shape({ current: PropTypes.shape({ confirm: PropTypes.func.isRequired }) }).isRequired,
  error: PropTypes.shape({ message: PropTypes.string })
}
export default Header
