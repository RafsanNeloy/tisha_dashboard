import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {
    const user = useSelector(state => state.user)
    
    return user.loggedIn ? children : <Navigate to="/" />
}

export default PrivateRoute