import axios from 'axios'

const url='https://dct-billing-app.herokuapp.com/api/products'

export const setProducts = (data) => {
    return {
        type: 'SET_PRODUCTS',
        payload: data
    }
}

export const addProduct = (data) => {
    return {
        type: 'ADD_PRODUCT',
        payload: data
    }
}

export const updateProduct = (data) => {
    return {
        type: 'UPDATE_PRODUCT',
        payload: data
    }
}

export const deleteProduct = (data) => {
    return {
        type: 'DELETE_PRODUCT',
        payload: data
    }
}

export const asyncGetProducts = () => {
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
                dispatch(setProducts(data))
            })
            .catch(err => alert(err.message))
    }
}

export const asyncAddProducts = (data, reset) => {
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
                dispatch(addProduct(data))
                reset()
            })
            .catch(err => alert(err.message))
    }
}

export const asyncUpdateProducts = (id, data, reset) => {
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
                dispatch(updateProduct(data))
                reset()
            })
            .catch(err => alert(err.message))
    }
}

export const asyncDeleteProducts = (id) => {
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
                dispatch(deleteProduct(data))
            })
            .catch(err => alert(err.message))
    }
}

export const asyncProductDetail = (id, stateChange) => {
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
                stateChange(data)
            })
            .catch(err => alert(err.message))
    }
}