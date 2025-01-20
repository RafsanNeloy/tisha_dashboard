import { Container, Typography, Box, makeStyles } from '@material-ui/core'
import React from 'react'

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
        return total
    }

    return (
        <Container>
            <Box className={classes.ordersSection}>
                <Box display='flex' flexDirection='row' justifyContent='space-around'>
                    <Typography variant='body1'><strong>Total Products:</strong></Typography>
                    <Typography variant='body1'>{lineItems.length}</Typography>
                </Box>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography variant='body1'><strong>Total Amount (in INR):</strong></Typography>               
                    <Typography variant='h2' align='center'>{calculateTotal(lineItems)}</Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default OrderDetails