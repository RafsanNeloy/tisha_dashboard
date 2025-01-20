import axios from 'axios'

// Create axios instance with default config
const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default axiosInstance 