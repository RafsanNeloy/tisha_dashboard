import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import { setLogin } from '../../action/loginAction'
import { asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import { asyncGetProducts } from '../../action/productAction'
import { asyncGetUser } from '../../action/userAction'
import AppBar from './AppBar'
import Drawer from './Drawer'
import HomePage from '../HomePage/HomePage'
import LoginRegisterPage from '../HomePage/LoginRegisterPage'
import UserPage from '../UserPage/UserPage'
import CustomerPage from '../CustomerPage/CustomerPage'
import ProductPage from '../ProductPage/ProductPage'
import BillsPage from '../BillsPage/BillsPage'
import AddBill from '../BillsPage/Generate New Bill/AddBill'
import ViewCustomer from '../CustomerPage/View Customer/ViewCustomer'
import BillView from '../BillsPage/View Bill/BillView'
import Dashboard from '../Dashboard/Dashboard'
import WestageForm from '../WestagePage/WestageForm'
import LessForm from '../LessPage/LessForm'
import CollectionForm from '../CustomerPage/Collections/CollectionForm'
import CustomerDetails from '../CustomerPage/customer_details'
import PrivateRoute from './PrivateRoute'

const NavBar = (props) => {
    const isLoggedIn = useSelector(state => state.login)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(setLogin())
            dispatch(asyncGetCustomers())
            dispatch(asyncGetProducts())
            dispatch(asyncGetBills())
            if (location.pathname === '/' || location.pathname === '/login-or-register') {
                navigate('/dashboard')
            }
        }
    }, [dispatch, navigate, location.pathname])

    return(
        <div>
            {isLoggedIn ? <Drawer /> : <AppBar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login-or-register" element={<LoginRegisterPage />} />
                <Route path="/profile" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                <Route path="/customers" element={<PrivateRoute><CustomerPage /></PrivateRoute>} />
                <Route path="/products" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
                <Route path="/bills" element={<PrivateRoute><BillsPage /></PrivateRoute>} />
                <Route path="/addBill" element={<PrivateRoute><AddBill /></PrivateRoute>} />
                <Route path="/customer-details/:customerId" element={<PrivateRoute><CustomerDetails /></PrivateRoute>} />
                <Route path="/customers/:id" element={<PrivateRoute><ViewCustomer /></PrivateRoute>} />
                <Route path="/bills/:id" element={<PrivateRoute><BillView /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/westage" element={<PrivateRoute><WestageForm /></PrivateRoute>} />
                <Route path="/less" element={<PrivateRoute><LessForm /></PrivateRoute>} />
                <Route path="/collections" element={<PrivateRoute><CollectionForm /></PrivateRoute>} />
            </Routes>
        </div>
    )
}

export default NavBar