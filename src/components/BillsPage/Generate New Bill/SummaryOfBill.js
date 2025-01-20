import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, Typography, Divider, Button, Container } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CustomerSuggestion from './CustomerSuggestion'
import OrderDetails from './OrderDetails'
import { useDispatch } from 'react-redux'
import { asyncAddBill } from '../../../action/billsAction'

const useStyle = makeStyles({
    summaryContainer: {
        height: '65vh'
    }, 
    title: {
        fontWeight: '700',
        textAlign: 'center'
    }
})

const SummaryOfBill = (props) => {
    const classes = useStyle()
    const { handleCustomerInfo, lineItems, customerInfo } = props
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            subTotal: item.subTotal
        }));

        // Calculate total
        const total = lineItems.reduce((sum, item) => sum + item.subTotal, 0);

        const billData = {
            date: new Date(),
            customer: customerInfo._id,
            items: formattedLineItems,
            total: total
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
                <Button 
                    variant='contained' 
                    color='primary' 
                    fullWidth
                    onClick={handleGenerateBill}
                >
                    Generate Bill
                </Button>
            </Container>
        </Paper>
    )
}

export default SummaryOfBill