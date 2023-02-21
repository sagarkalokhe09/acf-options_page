import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Discord, Instagram, Twitter, Github } from '../util'
import { APP_LINK, APP_NAME, SOCIAL_LINKS } from '../constants'

function Footer({ version }) {
  const { t } = useTranslation()

  let imageURL = 'https://getautoclicker.com/favicons/favicon48.png'
  if (/(DEV|BETA)/.test(process.env.REACT_APP_VARIANT)) {
    imageURL = `https://getautoclicker.com/favicons/${process.env.REACT_APP_VARIANT}/icon48.png`
  }

  return (
    <footer className='pt-4 mt-md-5 pt-md-5 border-top'>
      <Container>
        <Row>
          <Col md xs={12} className='mb-3'>
            <img
              src={imageURL}
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
                {APP_NAME}
                <span className={`${process.env.REACT_APP_VARIANT} ms-2`}>[{process.env.REACT_APP_VARIANT}]</span>
              </h6>
              <div className='text-muted'>
                <small>© 2017 - 2023</small>
                <small className='ms-2'>v{version}</small>
              </div>
            </div>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.resources')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='docs' href={`${APP_LINK.DOCS}getting-started`}>
                  {t('footer.docs')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' href={APP_LINK.BLOG} title='blog'>
                  {t('footer.blog')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='issues' href={APP_LINK.ISSUES}>
                  {t('footer.issues')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='configuration' href={APP_LINK.CONFIGS}>
                  {t('footer.configuration')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='practice form' href={APP_LINK.TEST}>
                  {t('footer.test')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.about')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='chat' href={SOCIAL_LINKS.GOOGLE_GROUP}>
                  {t('footer.chat')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='privacy' href='https://getautoclicker.com/policy/'>
                  {t('footer.privacy')}
                </a>
              </li>
            </ul>
          </Col>
          <Col md xs={4}>
            <h5 className='text-secondary'>{t('footer.social')}</h5>
            <ul className='list-unstyled text-small'>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='instagram' href={SOCIAL_LINKS.INSTAGRAM}>
                  <Instagram className='me-2' />
                  {t('footer.instagram')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' href={SOCIAL_LINKS.DISCORD} title='discord'>
                  <Discord className='me-2' />
                  {t('footer.discord')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='twitter' href={SOCIAL_LINKS.TWITTER}>
                  <Twitter className='me-2' />
                  {t('footer.twitter')}
                </a>
              </li>
              <li>
                <a className='text-decoration-none' target='_blank' rel='noopener noreferrer' title='github' href={SOCIAL_LINKS.GITHUB}>
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
