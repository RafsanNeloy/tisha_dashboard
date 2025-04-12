import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { englishToBengali, formatLargeNumber, convertMixedInputToNumber } from '../../../utils/bengaliNumerals'

const useStyle = makeStyles({
    ordersSection: {
        marginTop: '15px'
    }
})

const OrderDetails = ({ lineItems, additionalPrice = 0, showAdditionalPrice = false, discountPercentage = '' }) => {
    const classes = useStyle()

    // Calculate totals
    const subTotal = lineItems.reduce((sum, item) => sum + item.subTotal, 0);
    
    // Calculate discount
    const discountPercent = discountPercentage ? convertMixedInputToNumber(discountPercentage) : 0;
    const discountAmount = Math.floor(subTotal * (discountPercent / 100));
    
    // Calculate amount after discount
    const afterDiscount = subTotal - discountAmount;
    
    // Add service charge if enabled
    const serviceCharge = showAdditionalPrice ? Number(additionalPrice || 0) : 0;
    
    // Calculate final total
    const finalTotal = afterDiscount + serviceCharge;

    return (
        <Container>
            <Box className={classes.ordersSection}>
                <Box display='flex' flexDirection='row' justifyContent='space-around'>
                    <Typography variant='body1'><strong>মোট পণ্য:</strong></Typography>
                    <Typography variant='body1'>{englishToBengali(lineItems.length)}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography variant='body1'><strong>মোট টাকা:</strong></Typography>               
                    <Typography variant='h2' align='center'>৳{englishToBengali(finalTotal)}</Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default OrderDetails