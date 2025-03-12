import axios from 'axios'

const url = 'http://localhost:5000/api/bills'

export const setBills = (data) => {
    return {
        type: 'SET_BILLS',
        payload: data.reverse()
    }
}

export const addBill = (data) => {
    return {
        type: 'ADD_BILL',
        payload: data
    }
}

export const deleteBill = (data) => {
    return {
        type: 'DELETE_BILL',
        payload: data
    }
}

export const asyncGetBills = () => {
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
                dispatch(setBills(data))
            })
            .catch(err => alert(err.message))
    }
}

export const asyncAddBill = (data) => {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.post('http://localhost:5000/api/bills', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            dispatch(addBill(response.data));
            return response;
        } catch (error) {
            throw error;
        }
    };
}

export const asyncDeleteBill = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
        return new Promise((resolve, reject) => {
            axios.delete(`${url}/${id}`, config)
                .then(response => {
                    const data = response.data
                    dispatch(deleteBill(data))
                    resolve(data)
                })
                .catch(err => {
                    console.error('Delete bill error:', err)
                    reject(err)
                })
        })
    }
}

export const asyncGetBillDetail = (id, handleChange) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        return new Promise((resolve, reject) => {
            axios.get(`${url}/${id}`, config)
                .then(response => {
                    const data = response.data
                    handleChange(data)
                    resolve(data)
                })
                .catch(err => {
                    console.error('Failed to fetch bill details:', err)
                    reject(err)
                })
        })
    }
}

export const updateBillWastage = (billNumber, amount) => {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${url}/${billNumber}/wastage`, { amount }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            dispatch({ type: 'UPDATE_BILL', payload: response.data });
            return response;
        } catch (error) {
            console.error('Error updating wastage:', error);
            throw error;
        }
    };
};

export const updateBillLess = (billNumber, amount) => {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${url}/${billNumber}/less`, { amount }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            dispatch({ type: 'UPDATE_BILL', payload: response.data });
            return response;
        } catch (error) {
            console.error('Error updating less amount:', error);
            throw error;
        }
    };
};

export const updateBillCollection = (billNumber, amount) => {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${url}/${billNumber}/collection`, { amount }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            dispatch({ type: 'UPDATE_BILL', payload: response.data });
            return response;
        } catch (error) {
            console.error('Error updating collection:', error);
            throw error;
        }
    };
};