const initialAuthState = {
    user: null,
    isAuthenticated: false
}

const authReducer = (state = initialAuthState, action) => {
    switch(action.type) {
        case 'SET_USER':
            console.log('Setting user in reducer:', action.payload)
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true
            }
        case 'REMOVE_USER':
            return {
                ...state,
                user: null,
                isAuthenticated: false
            }
        default:
            return state
    }
}

export default authReducer 