import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setLogin } from '../../action/loginAction'
import HomePage from '../HomePage/HomePage'
import LoginRegisterPage from '../HomePage/LoginRegisterPage'
import Drawer from './Drawer'
import AppBar from './AppBar'
import UserPage from '../UserPage/UserPage'
import CustomerPage from '../CustomerPage/CustomerPage'
import ProductPage from '../ProductPage/ProductPage'
import BillsPage from '../BillsPage/BillsPage'
import AddBill from '../BillsPage/Generate New Bill/AddBill'
import ViewCustomer from '../CustomerPage/View Customer/ViewCustomer'
import BillView from '../BillsPage/View Bill/BillView'
import Dashboard from '../Dashboard/Dashboard'
import PrivateRoute from './PrivateRoute'

const NavBar = (props) => {
    const isLoggedIn = useSelector(state => state.login)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (localStorage.getItem('token') && 
            (location.pathname === '/' || location.pathname === '/login-or-register')) {
            dispatch(setLogin())
            navigate('/dashboard')
        } else if (localStorage.getItem('token')) {
            dispatch(setLogin())
        }
    }, [dispatch, navigate, location.pathname])

    return(
        <div>
            {
                isLoggedIn ? (
                    <Drawer />
                ) : (
                    <AppBar />
                )
            }

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login-or-register" element={<LoginRegisterPage />} />
                <Route path="/profile" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                <Route path="/customers" element={<PrivateRoute><CustomerPage /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
                <Route path="/bills" element={<PrivateRoute><BillsPage /></PrivateRoute>} />
                <Route path="/addBill" element={<PrivateRoute><AddBill /></PrivateRoute>} />
                <Route path="/customers/:id" element={<PrivateRoute><ViewCustomer /></PrivateRoute>} />
                <Route 
                    path="/bills/:id" 
                    element={
                        <PrivateRoute>
                            <BillView />
                        </PrivateRoute>
                    } 
                />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            </Routes>
        </div>
    )
}

export default NavBar