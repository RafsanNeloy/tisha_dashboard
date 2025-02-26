import React, { memo } from 'react'
import { Typography, Container, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ViewOrderTable from './ViewOrderTable'
import moment from 'moment'

const useStyles = makeStyles({
    accordion: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        margin: '4px 0'
    },
    accordionSummary: {
        backgroundColor: '#f5f5f5',
        minHeight: 56
    },
    orderInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    }
});

const CustomerOrders = memo(({ bills }) => {
    const classes = useStyles()

    if (!bills || bills.length === 0) {
        return <Typography>No orders found</Typography>
    }

    return (
        <>
            <Typography variant='h5' align='center' gutterBottom>
                List of Orders - {bills.length}
            </Typography>
            
            {bills.map(bill => (
                <Accordion 
                    key={bill.billNumber}
                    className={classes.accordion}
                >
                    <AccordionSummary
                        className={classes.accordionSummary}
                    >
                        <Box className={classes.orderInfo}>
                            <Typography>
                                {moment(bill.date).format('DD/MM/YYYY, hh:mm A')}
                            </Typography>
                            <Typography>
                                Bill ID - {bill.billNumber}
                            </Typography>
                            <Typography>
                                Total - {bill.total} ৳
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ViewOrderTable lineItems={bill.items} total={bill.total} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
});

export default CustomerOrders