import React from 'react'
import NavBar from './components/NavBar/NavBar.js'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CustomerDetails from './components/CustomerPage/customer_details'
import { Routes, Route } from 'react-router-dom'
import WestageForm from './components/WestagePage/WestageForm'
import LessForm from './components/LessPage/LessForm'
import CollectionForm from './components/CustomerPage/Collections/CollectionForm'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme/theme'

const App = (props) => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar {...props} />
      <Routes>
        <Route path="/customer-details/:customerId" element={<CustomerDetails />} />
        <Route path="/westage" element={<WestageForm />} />
        <Route path="/less" element={<LessForm />} />
        <Route path="/collections" element={<CollectionForm />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App