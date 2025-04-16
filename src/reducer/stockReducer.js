const initialState = {};

const stockReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_STOCK':
            return {
                ...state,
                [action.payload.productId]: action.payload.stockData
            };
        default:
            return state;
    }
};

export default stockReducer; 