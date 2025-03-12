import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, Typography, Divider, Button, Container, TextField, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CustomerSuggestion from './CustomerSuggestion'
import OrderDetails from './OrderDetails'
import { useDispatch } from 'react-redux'
import { asyncAddBill } from '../../../action/billsAction'
import { englishToBengali, bengaliToEnglish, isValidMixedNumber, convertMixedInputToNumber } from '../../../utils/bengaliNumerals'

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
        // Validate required fields
        if (!customerInfo._id || lineItems.length === 0) {
            props.onGenerateError({ 
                response: { 
                    data: { message: 'Please select a customer and add at least one product' }
                }
            });
            return;
        }

        props.setIsLoading(true);

        // Format line items with required fields from the model
        const formattedLineItems = lineItems.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
            product_type: item.product_type,
            subTotal: item.subTotal
        }));

        const billData = {
            date: new Date(),
            customer: customerInfo._id,
            items: formattedLineItems,
            total: finalTotal // Use the discounted total
        };

        dispatch(asyncAddBill(billData, navigate))
            .then(response => {
                props.onGenerateSuccess(response.data._id);
            })
            .catch(error => {
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