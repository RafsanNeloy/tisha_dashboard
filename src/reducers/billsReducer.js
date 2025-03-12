const billsReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_BILLS':
            return action.payload
        case 'ADD_BILL':
            return [action.payload, ...state]
        case 'DELETE_BILL':
            return state.filter(bill => bill._id !== action.payload._id)
        case 'UPDATE_BILL':
            return state.map(bill => 
                bill._id === action.payload._id ? action.payload : bill
            )
        default:
            return state
    }
}

export default billsReducer; 