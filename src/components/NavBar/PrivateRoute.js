import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {
    const isLoggedIn = useSelector(state => state.login)
    const location = useLocation()
    
    return isLoggedIn ? children : <Navigate to="/login-or-register" state={{ from: location }} replace />
}

export default PrivateRoute