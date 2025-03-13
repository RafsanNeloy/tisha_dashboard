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
import CustomerSuggestion from '../../BillsPage/Generate New Bill/CustomerSuggestion';
import { addCustomerPayment, getCustomerPayments } from '../../../action/customerAction';
import { formatLargeNumber } from '../../../utils/bengaliNumerals';
import AmountHighlight from '../../common/AmountHighlight';

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

const CollectionForm = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const [customerData, setCustomerData] = useState(null);

    useEffect(() => {
        if (customerInfo?._id) {
            fetchCustomerData();
        }
    }, [customerInfo]);

    const fetchCustomerData = async () => {
        try {
            const data = await dispatch(getCustomerPayments(customerInfo._id));
            setCustomerData(data);
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
            await dispatch(addCustomerPayment(customerInfo._id, {
                type: 'collection',
                amount: Number(amount)
            }));
            
            setAlert({
                open: true,
                message: 'Collection amount added successfully',
                severity: 'success'
            });

            // Refresh customer data
            fetchCustomerData();
            setAmount('');
        } catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'Error adding collection amount',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" className={classes.title}>
                            কালেকশন এন্ট্রি
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
                                total={customerData.totalAmount} 
                                remaining={customerData.remainingAmount} 
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
                                        {customerData.paymentInfo.map((payment, index) => (
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

export default CollectionForm; 