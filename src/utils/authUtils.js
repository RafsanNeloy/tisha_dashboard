import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'

export const isTokenExpired = () => {
    const token = localStorage.getItem('token')
    if (!token) return true

    try {
        const decodedToken = jwtDecode(token)
        const currentTime = Date.now() / 1000 // Convert to seconds

        if (decodedToken.exp < currentTime) {
            // Token has expired
            localStorage.removeItem('token') // Clear expired token
            return true
        }

        return false
    } catch (error) {
        console.error('Error decoding token:', error)
        return true
    }
}

export const checkAuthAndRedirect = (navigate, onExpired) => {
    const token = localStorage.getItem('token')
    
    if (!token || isTokenExpired()) {
        localStorage.removeItem('token') // Clear any invalid/expired token
        
        Swal.fire({
            title: 'Session Expired',
            text: 'Your session has expired. Please login again.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/login-or-register')
            } else if (onExpired) {
                onExpired()
            }
        })
        return false
    }
    return true
} 