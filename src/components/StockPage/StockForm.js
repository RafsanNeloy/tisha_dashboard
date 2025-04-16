import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Alert,
    Snackbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { updatePreviousStock } from '../../action/stockAction';
import { englishToBengali } from '../../utils/bengaliNumerals';
import axios from 'axios';

const useStyle = makeStyles({
    container: {
        padding: '2vh 2vw',
        maxWidth: '1200px',
        margin: '20px auto'
    },
    title: {
        fontWeight: '700',
        marginBottom: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    }
});

const StockForm = ({ product }) => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const [previousStock, setPreviousStock] = useState(0);

    useEffect(() => {
        if (product?._id) {
            const fetchStockData = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(
                        `http://localhost:5001/api/stock/${product._id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    setPreviousStock(response.data.previousStock || 0);
                } catch (error) {
                    // If stock doesn't exist, use default values
                    setPreviousStock(0);
                }
            };
            fetchStockData();
        }
    }, [product]);

    const handleUpdatePreviousStock = async () => {
        setLoading(true);
        try {
            await dispatch(updatePreviousStock(product._id, previousStock));
            
            setAlert({
                open: true,
                message: 'পূর্ববর্তী স্টক আপডেট করা হয়েছে',
                severity: 'success'
            });
        } catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'পূর্ববর্তী স্টক আপডেট করতে সমস্যা হয়েছে',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className={classes.container}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" className={classes.title}>
                    {product?.name} - পূর্ববর্তী স্টক
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        label="পূর্ববর্তী স্টক"
                        type="number"
                        value={previousStock}
                        onChange={(e) => setPreviousStock(e.target.value)}
                        fullWidth
                        size="small"
                    />
                    <Button
                        variant="contained"
                        onClick={handleUpdatePreviousStock}
                        disabled={loading}
                    >
                        {loading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert
                    onClose={() => setAlert({ ...alert, open: false })}
                    severity={alert.severity}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default StockForm; 