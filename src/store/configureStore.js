import { createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import customerReducer from '../reducer/customerReducer'
import loginReducer from '../reducer/loginReducer'
import productReducer from '../reducer/productReducer'
import userReducer from '../reducer/userReducer'
import billsReducer from '../reducer/billsReducer'
import authReducer from '../reducer/authReducer'
import stockReducer from '../reducer/stockReducer'

const configureStore = () => {
    const store = createStore(combineReducers({
        login: loginReducer,
        user: userReducer,
        customers: customerReducer, 
        products: productReducer,
        bills: billsReducer,
        auth: authReducer,
        stock: stockReducer
    }), applyMiddleware(thunk))
    return store
}

export default configureStore