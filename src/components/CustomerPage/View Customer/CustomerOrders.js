import React from 'react'
import { Typography, Container, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ViewOrderTable from './ViewOrderTable'
import moment from 'moment'

const useStyles = makeStyles({
    accordion: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    accordionSummary: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    accordionDetails: {
        padding: '16px'  // equivalent to theme.spacing(2)
    },
    expanded: {},
    orderInfo: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

const CustomerOrders = (props) => {
    const { bills } = props
    const classes = useStyles()

    return (
        <>
            <Typography variant='h5' align='center'>List of Orders - {bills.length}</Typography>
            {bills.map(bill => (
                <Accordion 
                    key={bill._id}
                    className={classes.accordion}
                >
                    <AccordionSummary
                        className={classes.accordionSummary}
                    >
                        <Box className={classes.orderInfo}>
                            <Typography variant='h6'>
                                {moment(bill.date).format('DD/MM/YYYY, hh:mm A')}
                            </Typography>
                            <Typography variant='h6'>
                                Order ID - {bill._id}
                            </Typography>
                            <Typography variant='h6'>
                                Total - Rs.{bill.total}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails}>
                        <Container>
                            <ViewOrderTable lineItems={bill.items} total={bill.total} />
                        </Container>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}

export default CustomerOrders