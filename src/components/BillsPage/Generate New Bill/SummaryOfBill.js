import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, Typography, Divider, Button, Container, TextField, Box, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CustomerSuggestion from './CustomerSuggestion'
import OrderDetails from './OrderDetails'
import { useDispatch } from 'react-redux'
import { asyncAddBill } from '../../../action/billsAction'
import { englishToBengali, bengaliToEnglish, isValidMixedNumber, convertMixedInputToNumber, formatLargeNumber } from '../../../utils/bengaliNumerals'

const useStyle = makeStyles({
    summaryContainer: {
        height: '65vh'
    }, 
    title: {
        fontWeight: '700',
        textAlign: 'center'
    },
    amountContainer: {
        padding: '16px',
        marginTop: '16px'
    },
    discountInput: {
        marginTop: '16px',
        marginBottom: '16px'
    }
})

const SummaryOfBill = (props) => {
    const classes = useStyle()
    const { handleCustomerInfo, lineItems, customerInfo } = props
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [discountPercentage, setDiscountPercentage] = useState('')
    const [wastageAmount, setWastageAmount] = useState(0)
    const [lessAmount, setLessAmount] = useState(0)
    const [collectionAmount, setCollectionAmount] = useState(0)

    // Calculate totals
    const subtotal = lineItems.reduce((sum, item) => sum + item.subTotal, 0)
    const discountAmount = discountPercentage ? 
        Math.floor(subtotal * (convertMixedInputToNumber(discountPercentage) / 100)) : 0
    const finalTotal = subtotal - discountAmount

    const handleDiscountChange = (e) => {
        const value = e.target.value
        
        // Allow empty input
        if (value === '') {
            setDiscountPercentage('')
            return
        }
        
        // Validate input contains only numbers (Bengali or English)
        if (!isValidMixedNumber(value)) return
        
        // Convert mixed Bengali/English input to number
        const percentage = convertMixedInputToNumber(value)
        if (percentage < 0 || percentage > 100) return // Keep percentage between 0-100
        
        setDiscountPercentage(value)
    }

    const handleGenerateBill = () => {
        if (!customerInfo?._id || lineItems.length === 0) {
            props.onGenerateError({ 
                response: { 
                    data: { message: 'Please select a customer and add at least one product' }
                }
            });
            return;
        }

        props.setIsLoading(true);

        // Format line items properly
        const formattedLineItems = lineItems.map(item => ({
            product: item._id,
            quantity: Number(item.quantity),
            price: Number(item.price),
            product_type: Number(item.product_type),
            subTotal: Number(item.subTotal)
        }));

        // Calculate remaining amount
        const total = Number(finalTotal);
        const wastage = Number(wastageAmount) || 0;
        const less = Number(lessAmount) || 0;
        const collection = Number(collectionAmount) || 0;
        const remaining = total - wastage - less - collection;

        const billData = {
            customer: customerInfo._id,
            items: formattedLineItems,
            total,
            wastageAmount: wastage,
            lessAmount: less,
            collectionAmount: collection,
            remainingAmount: remaining
        };

        console.log('Submitting bill data:', billData);

        dispatch(asyncAddBill(billData))
            .then(response => {
                console.log('Bill created successfully:', response);
                props.onGenerateSuccess(response.data._id);
            })
            .catch(error => {
                console.error('Error creating bill:', error);
                props.onGenerateError(error);
            })
            .finally(() => {
                props.setIsLoading(false);
            });
    }

    return (
        <Paper elevation={3} className={classes.summaryContainer}>
            <Typography className={classes.title} variant='h5'>Summary of bill</Typography>
            <Divider />
            <Container>
                <CustomerSuggestion handleCustomerInfo={handleCustomerInfo} />
            </Container>
            <Divider />
            <OrderDetails lineItems={lineItems} />
            <Container>
                <Box className={classes.amountContainer}>
                    <Typography variant="h6">
                        <strong>Subtotal:</strong> ৳{englishToBengali(subtotal)}
                    </Typography>
                    
                    <TextField
                        className={classes.discountInput}
                        fullWidth
                        label="Discount Percentage"
                        value={discountPercentage}
                        onChange={handleDiscountChange}
                        variant="outlined"
                        placeholder="0"
                        InputProps={{
                            endAdornment: <span>%</span>,
                        }}
                    />
                    
                    {discountAmount > 0 && (
                        <Typography variant="h6" style={{ color: 'green' }}>
                            <strong>(-) Discount:</strong> ৳{englishToBengali(discountAmount)}
                        </Typography>
                    )}
                    
                    <Typography variant="h6" style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        <strong>Final Total:</strong> ৳{englishToBengali(finalTotal)}
                    </Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Wastage Amount"
                            type="number"
                            value={wastageAmount}
                            onChange={(e) => setWastageAmount(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Less Amount"
                            type="number"
                            value={lessAmount}
                            onChange={(e) => setLessAmount(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Collection Amount"
                            type="number"
                            value={collectionAmount}
                            onChange={(e) => setCollectionAmount(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography variant="h6">
                            Remaining: ৳{formatLargeNumber(finalTotal - wastageAmount - lessAmount - collectionAmount)}
                        </Typography>
                    </Grid>
                </Grid>
                
                <Button 
                    variant='contained' 
                    color='primary' 
                    fullWidth
                    onClick={handleGenerateBill}
                    style={{ marginTop: '16px' }}
                >
                    Generate Bill
                </Button>
            </Container>
        </Paper>
    )
}

export default SummaryOfBill