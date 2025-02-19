import React, { useState } from 'react';
import { 
    Container, 
    TextField, 
    Button, 
    Box, 
    Typography,
    Paper
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CustomerSuggestion from '../BillsPage/Generate New Bill/CustomerSuggestion';

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

const LessForm = () => {
    const classes = useStyle();
    const [formData, setFormData] = useState({
        date: '',
        billNo: '',
        amount: ''
    });
    const [customerInfo, setCustomerInfo] = useState(null);

    const handleCustomerInfo = (customer) => {
        setCustomerInfo(customer);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const lessData = {
            customer: customerInfo?._id,
            date: formData.date,
            billNo: formData.billNo,
            amount: Number(formData.amount)
        };

        console.log('Less Data:', lessData);
        // Here you would typically dispatch an action to save the less data
        
        // Reset form
        setFormData({
            date: '',
            billNo: '',
            amount: ''
        });
        setCustomerInfo(null);
    };

    return (
        <Container className={classes.container}>
            <Paper elevation={3} sx={{ padding: '20px' }}>
                <Typography variant="h4" className={classes.title}>
                    লেস এন্ট্রি
                </Typography>
                
                <form onSubmit={handleSubmit} className={classes.form}>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            গ্রাহক নির্বাচন করুন
                        </Typography>
                        <CustomerSuggestion handleCustomerInfo={handleCustomerInfo} />
                    </Box>

                    <TextField
                        name="date"
                        label="তারিখ"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        required
                    />

                    <TextField
                        name="billNo"
                        label="বিল নং"
                        value={formData.billNo}
                        onChange={handleChange}
                        fullWidth
                        required
                    />

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
                        disabled={!customerInfo || !formData.date || !formData.billNo || !formData.amount}
                    >
                        সম্পন্ন করুন
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default LessForm; 