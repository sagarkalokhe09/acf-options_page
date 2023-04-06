import React from 'react'
import PropTypes from 'prop-types'
import { GoogleAds } from './google-ads.components'

export function Ads({ configIndex }) {
  if (window.location.href.match('.getautoclicker.com') !== null) {
    return <GoogleAds configIndex={configIndex} />
  }
  return null
}
Ads.defaultProps = {
  configIndex: -1
}

Ads.propTypes = {
  configIndex: PropTypes.number
}
