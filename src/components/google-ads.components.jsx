import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'

export function GoogleAds({ client, slot, className, setLoaded }) {
  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    setTimeout(() => {
      if (!window.adsLoaded) {
        setLoaded(false)
      }
    }, 1000)
  }, [])

  return (
    <Row>
      <Col xs={12} className='text-center'>
        <ins className={`${className} adsbygoogle`} style={{ display: 'inline-block', width: '728px', height: '90px' }} data-ad-client={client} data-ad-slot={slot} />
      </Col>
    </Row>
  )
}
GoogleAds.defaultProps = {
  className: 'mb-3',
  client: process.env.REACT_APP_GOOGLE_ADS_CLIENT,
  slot: process.env.REACT_APP_GOOGLE_ADS_SLOT
}
GoogleAds.propTypes = {
  client: PropTypes.string,
  slot: PropTypes.string,
  className: PropTypes.string,
  setLoaded: PropTypes.func.isRequired
}
