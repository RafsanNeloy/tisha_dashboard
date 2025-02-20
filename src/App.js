import React, { useEffect } from 'react'
import NavBar from './components/NavBar/NavBar.js'
import './App.css'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme/theme'
import { useDispatch } from 'react-redux'
import { asyncGetUser } from './action/userAction'

const App = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(asyncGetUser())
  }, [dispatch])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar {...props} />
    </ThemeProvider>
  )
}

export default App