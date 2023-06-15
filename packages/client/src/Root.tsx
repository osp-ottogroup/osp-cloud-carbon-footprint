import React, { useMemo } from 'react'
import { defaultTheme, darkTheme } from './utils/themes'
import loadConfig from './ConfigLoader'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, FormControlLabel, Switch  } from '@material-ui/core'
import { App } from './App'

export function Root() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const theme = useMemo(() => (isDarkMode ? darkTheme() : defaultTheme()), [isDarkMode])
  const config = useMemo(() => loadConfig(), [])

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={handleThemeToggle} />}
          label="Toggle Theme"
        />
        <App config={config} />
      </ThemeProvider>
    </BrowserRouter>
  )
}
