import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'

export function GoogleAds({ client, slot, className, configIndex }) {
  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <Row>
      <Col xs={12} className='text-center'>
        <ins
          className={`${className} adsbygoogle`}
          data-configIndex={configIndex}
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format='auto'
          data-full-width-responsive='true'
        />
      </Col>
    </Row>
  )
}
GoogleAds.defaultProps = {
  configIndex: -1,
  className: 'mb-3',
  client: process.env.REACT_APP_GOOGLE_ADS_CLIENT,
  slot: process.env.REACT_APP_GOOGLE_ADS_SLOT
}
GoogleAds.propTypes = {
  configIndex: PropTypes.number,
  client: PropTypes.string,
  slot: PropTypes.string,
  className: PropTypes.string
}
