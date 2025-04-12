import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { englishToBengali, formatLargeNumber } from '../../../utils/bengaliNumerals'

const useStyle = makeStyles({
    ordersSection: {
        marginTop: '15px'
    }
})

const OrderDetails = ({ lineItems, additionalPrice = 0, showAdditionalPrice = false }) => {
    const classes = useStyle()

    // Calculate totals
    const subTotal = lineItems.reduce((sum, item) => sum + item.subTotal, 0)
    const totalWithAdditional = subTotal + (showAdditionalPrice ? Number(additionalPrice) : 0)

    return (
        <Container>
            <Box className={classes.ordersSection}>
                <Box display='flex' flexDirection='row' justifyContent='space-around'>
                    <Typography variant='body1'><strong>মোট পণ্য:</strong></Typography>
                    <Typography variant='body1'>{englishToBengali(lineItems.length)}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography variant='body1'><strong>মোট টাকা:</strong></Typography>               
                    <Typography variant='h2' align='center'>৳{englishToBengali(totalWithAdditional)}</Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default OrderDetails