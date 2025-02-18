import React from 'react'
import NavBar from './components/NavBar/NavBar.js'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import ConnectionCheck from './components/ConnectionCheck/ConnectionCheck'

const theme = createTheme()

const App = (props) => {

  return (
    <ThemeProvider theme={theme}>
      <ConnectionCheck />
      <NavBar {...props} />
    </ThemeProvider>
  )
}

export default App