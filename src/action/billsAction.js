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

export const asyncAddBill = (data, navigate) => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
        return new Promise((resolve, reject) => {
            axios.post(url, data, config)
                .then(response => {
                    const responseData = response.data
                    dispatch(addBill(responseData))
                    resolve(response)
                })
                .catch(err => {
                    console.error('Bill generation error:', err);
                    reject(err)
                })
        })
    }
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