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
    CircularProgress
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerSuggestion from '../../BillsPage/Generate New Bill/CustomerSuggestion';
import BillSelector from '../../common/BillSelector';
import { updateBillCollection } from '../../../action/billsAction';

const useStyle = makeStyles({
    container: {
        padding: '2vh 2vw',
        maxWidth: '600px',
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
    },
    submitButton: {
        marginTop: '20px'
    }
});

const CollectionForm = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        amount: ''
    });
    const [customerInfo, setCustomerInfo] = useState(null);
    const [customerBills, setCustomerBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (customerInfo?._id) {
            fetchCustomerBills(customerInfo._id);
        } else {
            setCustomerBills([]);
            setSelectedBill(null);
        }
    }, [customerInfo]);

    const fetchCustomerBills = async (customerId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/customers/${customerId}/bills`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setCustomerBills(response.data.bills);
        } catch (error) {
            console.error('Error fetching bills:', error);
            setAlert({
                open: true,
                message: 'Error fetching customer bills',
                severity: 'error'
            });
        }
    };

    const handleCustomerInfo = (customer) => {
        setCustomerInfo(customer);
        setSelectedBill(null);
        setFormData({ amount: '' });
    };

    const handleBillSelect = (billNumber) => {
        setSelectedBill(billNumber);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await dispatch(updateBillCollection(selectedBill, Number(formData.amount)));
            
            setAlert({
                open: true,
                message: 'Collection amount updated successfully',
                severity: 'success'
            });

            // Refresh bills list
            if (customerInfo?._id) {
                fetchCustomerBills(customerInfo._id);
            }

            // Reset form
            setFormData({ amount: '' });
            setSelectedBill(null);
        } catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'Error updating collection amount',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className={classes.container}>
            <Paper elevation={3} sx={{ padding: '20px' }}>
                <Typography variant="h4" className={classes.title}>
                    কালেকশন এন্ট্রি
                </Typography>
                
                <form onSubmit={handleSubmit} className={classes.form}>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            গ্রাহক নির্বাচন করুন
                        </Typography>
                        <CustomerSuggestion handleCustomerInfo={handleCustomerInfo} />
                    </Box>

                    {customerInfo && (
                        <BillSelector
                            bills={customerBills}
                            selectedBill={selectedBill}
                            onBillSelect={handleBillSelect}
                        />
                    )}

                    <TextField
                        name="amount"
                        label="টাকার পরিমাণ"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        fullWidth
                        required
                    />

                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        disabled={loading || !customerInfo || !selectedBill || !formData.amount}
                    >
                        {loading ? 'Updating...' : 'সম্পন্ন করুন'}
                    </Button>
                </form>
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

export default CollectionForm; 