import React, { useState, useMemo } from 'react'
import { defaultTheme, darkTheme } from './utils/themes'
import loadConfig from './ConfigLoader'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { App } from './App'
import HeaderBar from './layout/HeaderBar'

export function Root() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const theme = useMemo(() => (isDarkMode ? darkTheme() : defaultTheme()),
                  [isDarkMode])
  const config = useMemo(() => loadConfig(), [])

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HeaderBar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
      <App config={config} />
    </ThemeProvider>
  </BrowserRouter>
  )
}
