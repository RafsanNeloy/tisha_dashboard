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
import MonthlyHistory from '../Dashboard/MonthlyHistory'
import PrivateRoute from './PrivateRoute'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import useDrawerState from '../../hooks/useDrawerState'

const useStyles = makeStyles({
  content: {
    flexGrow: 1,
    padding: '20px',
    marginLeft: props => props.isLoggedIn ? (props.isMobile ? '0px' : props.drawerWidth) : '0px',
    transition: 'margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    width: props => props.isLoggedIn ? `calc(100% - ${props.isMobile ? '0px' : props.drawerWidth}px)` : '100%',
  }
});

const NavBar = (props) => {
    const isLoggedIn = useSelector(state => state.login)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    
    const { drawerWidth, isMobile } = useDrawerState();
    const classes = useStyles({ isLoggedIn, drawerWidth, isMobile })

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
            <Box className={classes.content}>
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
                    <Route path="/history" element={<PrivateRoute><MonthlyHistory /></PrivateRoute>} />
                </Routes>
            </Box>
        </div>
    )
}

export default NavBar