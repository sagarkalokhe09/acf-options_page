import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const GoogleAds = ({ client, slot, format }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }, [])
  if (process.env.NODE_ENV === 'production') {
    return (
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive='true'
      />
    )
  }
  return <></>
}
GoogleAds.propTypes = {
  client: PropTypes.string.isRequired,
  slot: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired
}
export default GoogleAds
