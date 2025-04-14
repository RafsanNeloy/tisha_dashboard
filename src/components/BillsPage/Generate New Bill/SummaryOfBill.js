import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, Typography, Divider, Button, Container, TextField, Box, Grid, Checkbox, FormControlLabel } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CustomerSuggestion from './CustomerSuggestion'
import OrderDetails from './OrderDetails'
import { useDispatch } from 'react-redux'
import { asyncAddBill } from '../../../action/billsAction'
import { englishToBengali, bengaliToEnglish, isValidMixedNumber, convertMixedInputToNumber, formatLargeNumber } from '../../../utils/bengaliNumerals'
import { LoadingButton } from '@mui/lab'
import Swal from 'sweetalert2'
import axios from 'axios'

const useStyle = makeStyles({
    summaryContainer: {
        height: 'auto',
        minHeight: '65vh',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
    }, 
    title: {
        fontWeight: '700',
        textAlign: 'center',
        padding: '16px 0',
        fontSize: '1.5rem'
    },
    amountContainer: {
        padding: '20px',
        marginTop: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
    },
    discountInput: {
        marginTop: '16px',
        marginBottom: '16px'
    },
    totalContainer: {
        padding: '20px',
        marginTop: '16px',
        backgroundColor: '#f5f7ff',
        borderRadius: '8px'
    },
    totalText: {
        fontWeight: 'bold',
        fontSize: '1.2rem'
    },
    actionButton: {
        marginTop: '24px',
        marginBottom: '24px',
        padding: '12px',
        fontWeight: 'bold'
    },
    sectionDivider: {
        margin: '16px 0'
    }
})

const SummaryOfBill = (props) => {
    const classes = useStyle()
    const { handleCustomerInfo, lineItems, customerInfo } = props
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [discountPercentage, setDiscountPercentage] = useState('')
    const [showAdditionalPrice, setShowAdditionalPrice] = useState(false)
    const [additionalPrice, setAdditionalPrice] = useState(0)

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
        
        const formattedLineItems = lineItems.map(item => ({
            product: item._id,
            quantity: Number(item.quantity),
            price: Number(item.price),
            product_type: Number(item.product_type),
            subTotal: Number(item.subTotal)
        }));

        // Calculate subtotal
        const subtotal = lineItems.reduce((sum, item) => sum + item.subTotal, 0);
        
        // Calculate discount
        const discountPercent = discountPercentage ? 
            convertMixedInputToNumber(discountPercentage) : 0;
        const discountAmount = Math.floor(subtotal * (discountPercent / 100));
        
        // Get service charge
        const serviceCharge = showAdditionalPrice ? Number(additionalPrice || 0) : 0;
        
        // Calculate final total
        const totalAmount = subtotal - discountAmount + serviceCharge;

        const billData = {
            customer: customerInfo._id,
            items: formattedLineItems,
            total: totalAmount,
            additionalPrice: serviceCharge,
            discountPercentage: discountPercent,
            discountAmount: discountAmount // Add this explicitly
        };

        console.log('Sending bill data:', billData);

        dispatch(asyncAddBill(billData))
            .then(response => {
                props.onGenerateSuccess(response.data._id);
            })
            .catch(error => {
                console.error('Bill creation error:', error);
                props.onGenerateError(error);
            })
            .finally(() => {
                props.setIsLoading(false);
            });
    };

    // Calculate display values for the UI
    const subtotal = lineItems.reduce((sum, item) => sum + item.subTotal, 0);
    
    // Calculate discount amount
    const discountAmount = discountPercentage ? 
        Math.floor(subtotal * (convertMixedInputToNumber(discountPercentage) / 100)) : 0;
    
    // Get service charge amount
    const serviceCharge = showAdditionalPrice ? Number(additionalPrice || 0) : 0;
    
    // Calculate final total
    const finalTotal = subtotal - discountAmount + serviceCharge;

    return (
        <Paper elevation={3} className={classes.summaryContainer}>
            <Typography className={classes.title} variant='h5'>Summary of Bill</Typography>
            <Divider className={classes.sectionDivider} />
            
            <Container>
                <CustomerSuggestion handleCustomerInfo={handleCustomerInfo} />
            </Container>
            
            <Divider className={classes.sectionDivider} />
            
            <OrderDetails 
                lineItems={lineItems} 
                additionalPrice={additionalPrice}
                showAdditionalPrice={showAdditionalPrice}
                discountPercentage={discountPercentage}
            />
            
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
                            <strong>(-) কমিশন ({englishToBengali(discountPercentage)}%):</strong> ৳{englishToBengali(discountAmount)}
                        </Typography>
                    )}

                    <Typography variant="h6" sx={{ mt: 2 }}>
                        <strong>After Discount:</strong> ৳{englishToBengali(subtotal - discountAmount)}
                    </Typography>
                    
                    <FormControlLabel 
                        control={
                            <Checkbox 
                                checked={showAdditionalPrice}
                                onChange={(e) => setShowAdditionalPrice(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Add ট্রাঃ খরচ"
                        sx={{ mt: 2, mb: 1 }}
                    />
                    
                    {showAdditionalPrice && (
                        <>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="ট্রাঃ খরচ"
                                type="number"
                                value={additionalPrice}
                                onChange={(e) => setAdditionalPrice(e.target.value)}
                                inputProps={{ min: 0 }}
                                variant="outlined"
                                size="small"
                            />
                            {serviceCharge > 0 && (
                                <Typography variant="h6" sx={{ mt: 1 }}>
                                    <strong>(+) ট্রাঃ খরচ:</strong> ৳{englishToBengali(serviceCharge)}
                                </Typography>
                            )}
                        </>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" className={classes.totalText}>
                        <strong>Final Total:</strong> ৳{englishToBengali(finalTotal)}
                    </Typography>
                </Box>
                
                <LoadingButton 
                    loading={props.isLoading}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleGenerateBill}
                    disabled={!customerInfo || lineItems.length === 0}
                    className={classes.actionButton}
                    sx={{ 
                        fontSize: '1.05rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
                    }}
                >
                    Generate Bill
                </LoadingButton>
            </Container>
        </Paper>
    )
}

export default SummaryOfBill