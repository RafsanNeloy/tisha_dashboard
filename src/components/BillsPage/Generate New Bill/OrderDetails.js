import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const useStyle = makeStyles({
    ordersSection: {
        marginTop: '15px'
    }
})

const OrderDetails = (props) => {
    const { lineItems } = props
    const classes = useStyle()

    const calculateTotal = (data) => {
        let total = 0
        data.forEach(ele => total = total + ele.subTotal)
        return englishToBengali(total)
    }

    return (
        <Container>
            <Box className={classes.ordersSection}>
                <Box display='flex' flexDirection='row' justifyContent='space-around'>
                    <Typography variant='body1'><strong>মোট পণ্য:</strong></Typography>
                    <Typography variant='body1'>{englishToBengali(lineItems.length)}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography variant='body1'><strong>মোট টাকা:</strong></Typography>               
                    <Typography variant='h2' align='center'>৳{calculateTotal(lineItems)}</Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default OrderDetails