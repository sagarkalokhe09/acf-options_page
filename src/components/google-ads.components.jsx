import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

export const GoogleAds = ({ client, slot, format, className }) => {
  useEffect(() => {
    if (window.location.href.match('.getautoclicker.com') !== null) {
      // eslint-disable-next-line no-extra-semi
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }, [])
  if (window.location.href.match('.getautoclicker.com') !== null) {
    return <ins className={`${className} adsbygoogle`} style={{ display: 'block' }} data-ad-client={client} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive='true' />
  }
  return <></>
}
GoogleAds.defaultProps = {
  className: ''
}
GoogleAds.propTypes = {
  client: PropTypes.string.isRequired,
  slot: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  className: PropTypes.string
}
