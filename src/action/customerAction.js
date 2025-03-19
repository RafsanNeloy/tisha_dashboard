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
            // Ensure we're dispatching an array
            const customers = Array.isArray(response.data) ? response.data : [];
            dispatch(setCustomers(customers))
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

// Add payment (wastage/less/collection)
export const addCustomerPayment = (customerId, paymentData) => {
  return async (dispatch) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${url}/${customerId}/payment`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update customer in state
      dispatch({
        type: 'UPDATE_CUSTOMER',
        payload: response.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };
};

// Get customer payment history
export const getCustomerPayments = (customerId) => {
  return async (dispatch) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${url}/${customerId}/payments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
};