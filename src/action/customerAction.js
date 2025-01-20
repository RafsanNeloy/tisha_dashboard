import axios from 'axios'

const url='https://dct-billing-app.herokuapp.com/api/customers'

export const setCustomers = (data) => {
    return {
        type: 'SET_CUSTOMERS',
        payload: data
    }
}

export const addCustomer = (data) => {
    return {
        type: 'ADD_CUSTOMER',
        payload: data
    }
}

export const deleteCustomer = (data) => {
    return {
        type: 'DELETE_CUSTOMER',
        payload: data
    }
}

export const updateCustomer = (data) => {
    return {
        type: 'UPDATE_CUSTOMER',
        payload: data
    }
}

export const asyncCustomerDetail = (id, handleChange) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios.get(`${url}/${id}`, config)
            .then(response => {
                const data = response.data
                handleChange(data)
            })
            .catch(err => alert(err.message))
    }
}

export const asyncGetCustomers = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios.get(url, config)
            .then(response => {
                const data = response.data
                dispatch(setCustomers(data))
            })
            .catch(err => alert(err.message))
    }
}

export const asyncAddCustomer = (data, reset, closeModal) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios.post(url, data, config)
            .then(response => {
                const data = response.data
                dispatch(addCustomer(data))
                reset()
                if(closeModal) {
                    closeModal()
                }
            })
            .catch(err => alert(err.message))
    }
}

export const asyncDeleteCustomer = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios.delete(`${url}/${id}`, config)
            .then(response => {
                const data = response.data
                dispatch(deleteCustomer(data))
            })
            .catch(err => alert(err.message))
    }
}

export const asyncUpdateCustomer = (id, data, reset) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios.put(`${url}/${id}`, data, config)
            .then(response => {
                const data = response.data
                dispatch(updateCustomer(data))
                reset()
            })
            .catch(err => alert(err.message))
    }
}