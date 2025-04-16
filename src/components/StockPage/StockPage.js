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
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { englishToBengali, formatLargeNumber } from '../../utils/bengaliNumerals';
import ProductSuggestion from '../BillsPage/Generate New Bill/ProductSuggestion';

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

const StockPage = () => {
    const classes = useStyle();
    const [productInfo, setProductInfo] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const [stockData, setStockData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [previousStock, setPreviousStock] = useState('');

    useEffect(() => {
        if (productInfo?._id) {
            fetchStockData();
        }
    }, [productInfo]);

    const fetchStockData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5001/api/stock/${productInfo._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setStockData(response.data);
            setPreviousStock(response.data.previousStock || 0);
        } catch (error) {
            setAlert({
                open: true,
                message: 'Error fetching stock data',
                severity: 'error'
            });
        }
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        newDate.setHours(12, 0, 0, 0);
        setSelectedDate(newDate);
    };

    const calculateCurrentStock = () => {
        if (!stockData) return 0;
        const totalAdded = stockData.addedStock.reduce((sum, item) => sum + item.amount, 0);
        return stockData.previousStock + totalAdded - stockData.billedStock;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5001/api/stock/${productInfo._id}`,
                {
                    amount: Number(amount),
                    date: selectedDate.toISOString()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setAlert({
                open: true,
                message: 'স্টক সফলভাবে যোগ করা হয়েছে',
                severity: 'success'
            });

            fetchStockData();
            setAmount('');
            setSelectedDate(new Date());
        } catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'স্টক যোগ করতে সমস্যা হয়েছে',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousStockUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5001/api/stock/${productInfo._id}/previous`,
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

            setAlert({
                open: true,
                message: 'পূর্ববর্তী স্টক আপডেট করা হয়েছে',
                severity: 'success'
            });

            fetchStockData();
        } catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'পূর্ববর্তী স্টক আপডেট করতে সমস্যা হয়েছে',
                severity: 'error'
            });
        }
    };

    return (
        <Container className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" className={classes.title}>
                            স্টক এন্ট্রি
                        </Typography>

                        <form onSubmit={handleSubmit} className={classes.form}>
                            <ProductSuggestion
                                handleAddLineItem={(product) => {
                                    setProductInfo(product);
                                    setAmount('');
                                }}
                            />

                            <TextField
                                name="amount"
                                label="পরিমাণ"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                fullWidth
                                required
                            />

                            <TextField
                                type="date"
                                value={selectedDate.toISOString().split('T')[0]}
                                onChange={handleDateChange}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                label="তারিখ নির্বাচন করুন"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || !productInfo || !amount}
                            >
                                {loading ? 'Updating...' : 'স্টক যোগ করুন'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    {stockData && (
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    {productInfo?.name} - বর্তমান স্টক: {englishToBengali(calculateCurrentStock())}
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={8}>
                                        <TextField
                                            label="পূর্ববর্তী স্টক"
                                            type="number"
                                            value={previousStock}
                                            onChange={(e) => setPreviousStock(e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button
                                            variant="contained"
                                            onClick={handlePreviousStockUpdate}
                                            fullWidth
                                        >
                                            আপডেট
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Typography variant="h6" gutterBottom>
                                স্টক হিস্টরি
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>তারিখ</TableCell>
                                            <TableCell align="right">পরিমাণ</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stockData.addedStock.map((stock, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {new Date(stock.date).toLocaleDateString('bn-BD')}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {englishToBengali(stock.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </Grid>
            </Grid>

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

export default StockPage; 