import axios from 'axios'

const url = 'http://localhost:5000/api/customers'

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
    return async (dispatch) => {
        try {
            const response = await axios.get('http://localhost:5000/api/customers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(setCustomers(response.data))
            return response; // Return the response for chaining
        } catch (error) {
            console.log('Error fetching customers', error)
            throw error;
        }
    }
}

export const asyncAddCustomer = (formData, resetForm, handleClose) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
        axios.post(url, formData, config)
            .then((response) => {
                const customer = response.data
                dispatch(addCustomer(customer))
                resetForm()
                if(handleClose){
                    handleClose()
                }
            })
            .catch((err) => {
                alert(err.message)
            })
    }
}

export const asyncDeleteCustomer = (id) => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            
            const response = await axios.delete(`${url}/${id}`, config);
            dispatch(deleteCustomer(response.data));
            return response; // Return the response for chaining
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    };
}

export const asyncUpdateCustomer = (_id, formData, resetUpdateCust) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.put(`${url}/${_id}`, formData, config)
            .then((response) => {
                const customer = response.data
                dispatch(updateCustomer(customer))
                resetUpdateCust()
            })
            .catch((err) => {
                alert(err.message)
            })
    }
}