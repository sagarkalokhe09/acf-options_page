import React, { createContext, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

export const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light')
  }, [])

  useEffect(() => {
    document.body.className = ''
    document.body.classList.add(`bg-${theme}`)
    localStorage.setItem('theme', theme)
  }, [theme])

  const themeMemo = useMemo(() => ({ theme, setTheme }), [])
  return <ThemeContext.Provider value={themeMemo}>{children}</ThemeContext.Provider>
}

ThemeProvider.propTypes = {
  children: PropTypes.element.isRequired
}
export default ThemeProvider
