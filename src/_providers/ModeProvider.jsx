import React, { createContext, useEffect, useState, useMemo } from 'react'
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
  const modeMemo = useMemo(() => ({ mode, setMode }), [])
  return <ModeContext.Provider value={modeMemo}>{children}</ModeContext.Provider>
}

ModeProvider.propTypes = {
  children: PropTypes.element.isRequired
}
export default ModeProvider
