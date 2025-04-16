import axios from 'axios';

export const updateStockInStore = (productId, stockData) => ({
    type: 'UPDATE_STOCK',
    payload: { productId, stockData }
});

export const updatePreviousStock = (productId, previousStock) => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5001/api/stock/${productId}/previous`,
                {
                    previousStock: Number(previousStock)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            dispatch(updateStockInStore(productId, response.data));
            return response.data;
        } catch (error) {
            throw error;
        }
    };
}; 