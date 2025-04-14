import React, { useEffect } from 'react'
import NavBar from './components/NavBar/NavBar.js'
import './App.css'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme/theme'
import { useDispatch } from 'react-redux'
import { asyncGetUser, setLogout } from './action/userAction'
import { isTokenExpired } from './utils/authUtils'
import Watermark from './components/Watermark/Watermark'

const App = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(asyncGetUser())
  }, [dispatch])

  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
        if (isTokenExpired()) {
            dispatch(setLogout())
            localStorage.removeItem('token')
        }
    }, 60000)

    return () => clearInterval(checkTokenInterval)
  }, [dispatch])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Watermark />
      <NavBar {...props} />
    </ThemeProvider>
  )
}

export default App