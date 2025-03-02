const initialUserState = {} 

const userReducer = (state = initialUserState, action) => {
    switch(action.type) {
        case 'SET_USER':
            return {...action.payload}
        case 'LOGOUT_USER':
            return initialUserState
        default:
            return state
    }
}

export default userReducer