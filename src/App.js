import React from 'react'
import NavBar from './components/NavBar/NavBar.js'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CustomerDetails from './components/CustomerPage/customer_details'
import { Routes, Route } from 'react-router-dom'
import WestageForm from './components/WestagePage/WestageForm'
import LessForm from './components/LessPage/LessForm'

const theme = createTheme()

const App = (props) => {

  return (
    <ThemeProvider theme={theme}>
      <NavBar {...props} />
      <Routes>
        <Route path="/customer-details/:customerId" element={<CustomerDetails />} />
        <Route path="/westage" element={<WestageForm />} />
        <Route path="/less" element={<LessForm />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App