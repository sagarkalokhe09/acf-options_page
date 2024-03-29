import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const ModeContext = createContext()

function ModeProvider({ children }) {
  const [mode, setMode] = useState('light')
  useEffect(() => {
    setMode(localStorage.getItem('mode') || 'light')
  }, [])

  useEffect(() => {
    localStorage.setItem('mode', mode)
  }, [mode])
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>
}

ModeProvider.propTypes = {
  children: PropTypes.element.isRequired
}
export default ModeProvider
