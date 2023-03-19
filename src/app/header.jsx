import React, { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { GearFill, Moon, Sun } from '../util'
import { SettingsModal } from '../modal'
import { ThemeContext } from '../_providers/ThemeProvider'
import { APP_LANGUAGES, APP_NAME } from '../constants'

function Header({ confirmRef, error }) {
  const { theme, setTheme } = useContext(ThemeContext)
  const settingsRef = useRef()
  const { t, i18n } = useTranslation()

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
              <Nav.Link onClick={toggleTheme} className='px-4 py-3'>
                {theme !== 'light' ? <Sun width='24' height='24' title={t('header.theme.dark')} /> : <Moon width='24' height='24' title={t('header.theme.light')} />}
              </Nav.Link>

              {!error.message && (
                <>
                  <Nav.Link onClick={() => settingsRef.current.showSettings()} className='px-4 py-3'>
                    <GearFill width='24' height='24' title={t('header.settings')} />
                  </Nav.Link>
                  <NavDropdown title={i18n.language} id='language-nav-dropdown' align='end' className='text-uppercase px-2 py-2 fw-bolder'>
                    {APP_LANGUAGES.map(language => (
                      <NavDropdown.Item key={language} title={language} onClick={() => changeLanguage(language)} className='text-secondary'>
                        {t(`language.${language}`)}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                </>
              )}
              <SettingsModal ref={settingsRef} confirmRef={confirmRef} />
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
