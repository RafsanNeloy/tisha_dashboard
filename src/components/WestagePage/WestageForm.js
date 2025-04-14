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
import { useDispatch } from 'react-redux';
import axios from 'axios';
import CustomerSuggestion from '../BillsPage/Generate New Bill/CustomerSuggestion';
import { addCustomerPayment } from '../../action/customerAction';
import { formatLargeNumber } from '../../utils/bengaliNumerals';
import AmountHighlight from '../common/AmountHighlight';

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

const WestageForm = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const [customerData, setCustomerData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (customerInfo?._id) {
            fetchCustomerData();
        }
    }, [customerInfo]);

    const fetchCustomerData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5001/api/customers/${customerInfo._id}/bills`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            setCustomerData(response.data);
        } catch (error) {
            setAlert({
                open: true,
                message: 'Error fetching customer data',
                severity: 'error'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Format the date properly for the backend
            const formattedDate = new Date(selectedDate);
            // Set time to noon to avoid timezone issues
            formattedDate.setHours(12, 0, 0, 0);

            await dispatch(addCustomerPayment(customerInfo._id, {
                type: 'wastage',
                amount: Number(amount),
                date: formattedDate.toISOString()  // Send as ISO string
            }));
            
            setAlert({
                open: true,
                message: 'Wastage amount added successfully',
                severity: 'success'
            });

            // Refresh customer data
            fetchCustomerData();
            setAmount('');
            setSelectedDate(new Date()); // Reset date to current date
        } catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'Error adding wastage amount',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        // Create date object at noon to avoid timezone issues
        const newDate = new Date(e.target.value);
        newDate.setHours(12, 0, 0, 0);
        setSelectedDate(newDate);
    };

    return (
        <Container className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" className={classes.title}>
                            ভাঙ্গা এন্ট্রি
                        </Typography>
                        
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <CustomerSuggestion 
                                handleCustomerInfo={(customer) => {
                                    setCustomerInfo(customer);
                                    setAmount('');
                                }} 
                            />

                            <TextField
                                name="amount"
                                label="টাকার পরিমাণ"
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
                                disabled={loading || !customerInfo || !amount}
                            >
                                {loading ? 'Updating...' : 'সম্পন্ন করুন'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    {customerData && (
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <AmountHighlight 
                                total={customerData.stats.totalBillAmount} 
                                remaining={customerData.stats.totalRemaining} 
                            />

                            <Typography variant="h6" gutterBottom>
                                Bills History
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Bill Number</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customerData.bills.map((bill) => (
                                            <TableRow key={bill._id}>
                                                <TableCell>
                                                    {new Date(bill.date).toLocaleDateString('bn-BD')}
                                                </TableCell>
                                                <TableCell>{bill.billNumber}</TableCell>
                                                <TableCell align="right">
                                                    ৳{formatLargeNumber(bill.total)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                                Payment History
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customerData.customer.paymentInfo.map((payment, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {new Date(payment.date).toLocaleDateString('bn-BD')}
                                                </TableCell>
                                                <TableCell>{payment.type}</TableCell>
                                                <TableCell align="right">
                                                    ৳{formatLargeNumber(payment.amount)}
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

export default WestageForm; 