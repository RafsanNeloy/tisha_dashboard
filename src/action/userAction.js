import axios from 'axios'
import { asyncGetCustomers } from './customerAction'
import { asyncGetProducts } from './productAction'
import { asyncGetBills } from './billsAction'

const url = 'http://localhost:5001/api/users'  // Add base URL

export const setUser = (data) => {
    return {
        type: 'SET_USER',
        payload: data
    }
}

export const setLogout = () => {
    return {
        type: 'LOGOUT_USER'
    }
}

export const asyncGetUser = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        if(token) {
            axios.get('http://localhost:5001/api/users/account', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    const result = response.data
                    dispatch(setUser(result))
                })
                .catch((err) => {
                    alert(err.message)
                })
        }
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