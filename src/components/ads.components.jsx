import React from 'react'
import { GoogleAds } from './google-ads.components'

export function Ads() {
  if (window.location.href.match('.getautoclicker.com') !== null) {
    return <GoogleAds />
  }
  return null
}
