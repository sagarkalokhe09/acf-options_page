import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { BROWSER } from '@dhruv-techapps/core-common'
import { useTranslation } from 'react-i18next'
import { GTAG } from '../util'

const Footer = ({ version }) => {
  const { t } = useTranslation()

  return (
    <footer className='pt-4 mt-md-5 pt-md-5 border-top'>
      <Container>
        <Row>
          <Col md xs={12} className='mb-3'>
            <img
              src={`chrome-extension://${process.env[`REACT_APP_${BROWSER}_EXTENSION_ID`]}/assets/icons/icon48.png`}
              width='48'
              height='48'
              className='d-inline-block align-top me-2'
              alt='Auto click Auto Fill logo'
              title='Auto click Auto Fill logo'
              onError={e => {
                e.currentTarget.src = 'https://getautoclicker.com/favicons/favicon48.png'
              }}
            />
            <div className='d-inline-flex flex-column'>
              <h6 className='text-secondary mb-0'>
                {process.env.REACT_APP_NAME}
                <span className={`${process.env.REACT_APP_VARIANT} ms-2`}>{process.env.REACT_APP_VARIANT}</span>
              </h6>
              <div className='text-muted'>
                <small>© 2017 - 2021</small>
                <small className='ms-2'>v{version}</small>
              </div>
            </div>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.resources')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='docs'
                  href={`${process.env.REACT_APP_DOCS}getting-started`}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Docs' })
                  }}>
                  {t('footer.docs')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_BLOG}
                  title='blog'
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Blog' })
                  }}>
                  {t('footer.blog')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='examples'
                  href={process.env.REACT_APP_EXAMPLES}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Examples' })
                  }}>
                  {t('footer.examples')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='issues'
                  href={process.env.REACT_APP_ISSUES}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Issues' })
                  }}>
                  {t('footer.issues')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='test'
                  href={process.env.REACT_APP_TEST}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Test' })
                  }}>
                  {t('footer.test')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.about')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  author='Dhruv Techapps'
                  rel='noopener noreferrer'
                  title='contact'
                  href='mailto:dhruv.techapps@gmail.com'
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Mail' })
                  }}>
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='chat'
                  href={process.env.REACT_APP_DISCORD}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Chat' })
                  }}>
                  {t('footer.chat')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='privacy'
                  href='https://dhruv-techapps.github.io/policy'
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Privacy' })
                  }}>
                  {t('footer.privacy')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.social')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={process.env.REACT_APP_DISCORD}
                  title='discord'
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Discord' })
                  }}>
                  {t('footer.discord')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='twitter'
                  href={process.env.REACT_APP_TWITTER}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Twitter' })
                  }}>
                  {t('footer.twitter')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='github'
                  href={process.env.REACT_APP_GITHUB}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Github' })
                  }}>
                  {t('footer.github')}
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
Footer.propTypes = {
  version: PropTypes.string.isRequired
}
export default Footer
