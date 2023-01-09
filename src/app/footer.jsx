import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { GTAG, Discord, Instagram, Twitter, Github } from '../util'
import { APP_LINK, APP_NAME, SOCIAL_LINKS } from '../constants'

function Footer({ version }) {
  const { t } = useTranslation()

  return (
    <footer className='pt-4 mt-md-5 pt-md-5 border-top'>
      <Container>
        <Row>
          <Col md xs={12} className='mb-3'>
            <img
              src='https://getautoclicker.com/favicons/favicon48.png'
              width='48'
              height='48'
              className='d-inline-block align-top me-2'
              alt='Auto click Auto Fill logo'
              title='Auto click Auto Fill logo'
            />
            <div className='d-inline-flex flex-column'>
              <h6 className='text-secondary mb-0'>
                {APP_NAME}
                <span className={`${process.env.REACT_APP_VARIANT} ms-2`}>{process.env.REACT_APP_VARIANT}</span>
              </h6>
              <div className='text-muted'>
                <small>© 2017 - 2022</small>
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
                  href={`${APP_LINK.DOCS}getting-started`}
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
                  href={APP_LINK.BLOG}
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
                  title='issues'
                  href={APP_LINK.ISSUES}
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
                  title='configuration'
                  href={APP_LINK.CONFIGS}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Configurations' })
                  }}>
                  {t('footer.configuration')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='practice form'
                  href={APP_LINK.TEST}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Practice Form' })
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
                  rel='noopener noreferrer'
                  title='chat'
                  href={SOCIAL_LINKS.GOOGLE_GROUP}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Google Group' })
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
                  href='https://getautoclicker.com/policy/'
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
                  title='instagram'
                  href={SOCIAL_LINKS.INSTAGRAM}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Instagram' })
                  }}>
                  <Instagram className='me-2' />
                  {t('footer.instagram')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={SOCIAL_LINKS.DISCORD}
                  title='discord'
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Discord' })
                  }}>
                  <Discord className='me-2' />
                  {t('footer.discord')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='twitter'
                  href={SOCIAL_LINKS.TWITTER}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Twitter' })
                  }}>
                  <Twitter className='me-2' />
                  {t('footer.twitter')}
                </a>
              </li>
              <li>
                <a
                  className='text-decoration-none'
                  target='_blank'
                  rel='noopener noreferrer'
                  title='github'
                  href={SOCIAL_LINKS.GITHUB}
                  onClick={() => {
                    GTAG.event({ category: 'Footer', action: 'Click', label: 'Github' })
                  }}>
                  <Github className='me-2' />
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
