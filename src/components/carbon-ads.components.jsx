import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

export function CarbonAds({ code, placement }) {
  const reference = useRef()

  useEffect(() => {
    reference.current.innerHTML = ''
    const s = document.createElement('script')
    s.id = '_carbonads_js'
    s.src = `//cdn.carbonads.com/carbon.js?serve=${code}&placement=${placement}`
    reference.current.appendChild(s)
  }, [])
  return <div ref={reference} />
}

CarbonAds.propTypes = {
  code: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired
}
