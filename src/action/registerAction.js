import axios from 'axios'

export const asyncRegister = (data, changeTab, notify) => {
    return (dispatch) => {
        const url = 'https://dct-billing-app.herokuapp.com/api/users/register'
        axios.post(url, data) 
            .then(response => {
                const data = response.data
                console.log(data)
                if(!data.errors) {
                    changeTab('login')
                }
            })
            .catch(err => alert(err.message))
    }
}