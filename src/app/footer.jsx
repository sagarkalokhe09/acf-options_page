import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import GTAG from './gtag'
import { BROWSER } from '@dhruv-techapps/core-common'

const Footer = ({ version }) => {
  return (
    <Container>
      <footer className='pt-4 my-md-5 pt-md-5 border-top'>
        <Row>
          <Col md xs={12}>
            <img
              src={`chrome-extension://${process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]}/assets/icons/icon48.png`}
              width='48'
              height='48'
              className='d-inline-block align-top mr-2'
              alt='Auto click Auto Fill logo'
              onError={e => (e.currentTarget.src = 'https://getautoclicker.com/favicons/favicon48.png')}
            />
            <div className='d-inline-flex flex-column justify-content-center' style={{ height: '48px' }}>
              {process.env.REACT_APP_NAME}
              <small className={process.env.REACT_APP_VARIANT}>{process.env.REACT_APP_VARIANT}</small>
            </div>
            <small className='d-block my-2 text-muted'>© 2017 - 2021</small>
            <small className='d-block text-muted'>v{version}</small>
          </Col>
          <Col md xs={6}>
            <h5>Resources</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_DOCS + 'getting-started'}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Docs' })
                  }}>
                  Docs
                </a>
              </li>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_BLOG}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Blog' })
                  }}>
                  Blog
                </a>
              </li>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_EXAMPLES}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Examples' })
                  }}>
                  Examples
                </a>
              </li>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_ISSUES}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Issues' })
                  }}>
                  Issues
                </a>
              </li>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_TEST}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Test' })
                  }}>
                  Test
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={6}>
            <h5>About</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='mailto:dhruv.techapps@gmail.com'
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Mail' })
                  }}>
                  Contact
                </a>
              </li>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_DISCORD}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Chat' })
                  }}>
                  Chat
                </a>
              </li>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://dhruv-techapps.github.io/policy'
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Privacy' })
                  }}>
                  Privacy
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={6}>
            <h5>Social</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_DISCORD}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Discord' })
                  }}>
                  Discord
                </a>
              </li>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_TWITTER}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Twitter' })
                  }}>
                  Twitter
                </a>
              </li>
              <li>
                <a
                  className='text-muted'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_GITHUB}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Github' })
                  }}>
                  Github
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </footer>
    </Container>
  )
}
Footer.propTypes = {
  version: PropTypes.string.isRequired
}
export default Footer
