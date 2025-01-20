import React from 'react'
import NavBar from './components/NavBar/NavBar.js'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: '300',
    fontWeightRegular: '400',
    fontWeightMedium: '500',
    fontWeightBold: '700'
  },
  palette:{
    primary:{
      main: '#27a75c'
    },
    secondary:{
      main:'#f70074'
    }
  }
})

const App = (props) => {

  return (
    <ThemeProvider theme={theme}>
      <NavBar {...props} />
    </ThemeProvider>
  )
}

export default App