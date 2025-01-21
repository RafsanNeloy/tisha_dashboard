import axiosInstance from '../config/axios'

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

export const startGetProducts = () => {
    return (dispatch) => {
        axiosInstance.get(`/products`)
            .then((response) => {
                dispatch(setProducts(response.data))
            })
            .catch((err) => {
                console.log(err.message)
            })
    }
}

export const asyncAddProducts = (data, reset) => {
    return (dispatch) => {
        axiosInstance.post('/products', data)
            .then(response => {
                dispatch(addProduct(response.data))
                reset()
            })
            .catch(err => alert(err.message))
    }
}

export const asyncUpdateProducts = (id, data, reset) => {
    return (dispatch) => {
        axiosInstance.put(`/products/${id}`, data)
            .then(response => {
                dispatch(updateProduct(response.data))
                reset()
            })
            .catch(err => alert(err.message))
    }
}

export const asyncDeleteProducts = (id) => {
    return (dispatch) => {
        axiosInstance.delete(`/products/${id}`)
            .then(response => {
                dispatch(deleteProduct(response.data))
            })
            .catch(err => alert(err.message))
    }
}

export const asyncProductDetail = (id, stateChange) => {
    return (dispatch) => {
        axiosInstance.get(`/products/${id}`)
            .then(response => {
                stateChange(response.data)
            })
            .catch(err => alert(err.message))
    }
}