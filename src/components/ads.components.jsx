import React, { useState } from 'react'
import { CarbonAds, GoogleAds } from '.'

export function Ads() {
  const [loaded, setLoaded] = useState(true)

  if (window.location.href.match('.getautoclicker.com') !== null) {
    if (window.adsLoaded === false) {
      return <CarbonAds />
    }
    if (loaded) {
      return <GoogleAds setLoaded={setLoaded} />
    }
    return <CarbonAds />
  }
  return null
}
