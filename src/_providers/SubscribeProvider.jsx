import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const SubscribeContext = createContext()

const SubscribeProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null)
  useEffect(() => {}, [])

  return <SubscribeContext.Provider value={subscription}>{children}</SubscribeContext.Provider>
}

SubscribeProvider.propTypes = {
  children: PropTypes.element.isRequired
}
export default SubscribeProvider
