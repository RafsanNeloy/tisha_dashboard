import axios from 'axios'
import { asyncGetCustomers } from './customerAction'
import { asyncGetProducts } from './productAction'
import { asyncGetBills } from './billsAction'

const url = 'http://localhost:5000/api/users'  // Add base URL

export const setUser = (data) => {
    return {
        type: 'SET_USER',
        payload: data
    }
}

export const asyncGetUser = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        if (!token) {
            return; // Don't make the request if there's no token
        }
        
        axios.get(`${url}/account`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const data = response.data
                console.log('User Data from API:', data)
                dispatch(setUser(data)) // Store the entire user object
            })
            .catch(err => {
                console.error('Error fetching user:', err)
                alert(err.message)
            })
    }
}

export const asyncLoginUser = (formData, resetForm, navigate) => {
    return (dispatch) => {
        axios.post(`${url}/login`, formData)
            .then((response) => {
                const result = response.data
                localStorage.setItem('token', result.token)
                dispatch(setUser({
                    username: result.username,
                    email: result.email,
                    businessName: result.businessName,
                    role: result.role
                }))
                // Fetch all data after successful login
                dispatch(asyncGetCustomers())
                dispatch(asyncGetProducts())
                dispatch(asyncGetBills())
                resetForm()
                navigate('/')
            })
            .catch((err) => {
                alert(err.message)
            })
    }
}

export const asyncRegisterUser = (formData, resetForm, navigate) => {
    return (dispatch) => {
        axios.post(`${url}/register`, formData)
            .then((response) => {
                const result = response.data
                localStorage.setItem('token', result.token)
                dispatch(setUser({
                    username: result.username,
                    email: result.email,
                    businessName: result.businessName,
                    role: result.role
                }))
                // Fetch all data after successful registration
                dispatch(asyncGetCustomers())
                dispatch(asyncGetProducts())
                dispatch(asyncGetBills())
                resetForm()
                navigate('/')
            })
            .catch((err) => {
                alert(err.message)
            })
    }
}