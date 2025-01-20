import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { asyncDeleteBill, asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import moment from 'moment'

const useStyle = makeStyles({
    table: {
        position: 'fixed',
        width: '90vw',
        marginTop: '5px',
        maxHeight: '380px'
    },
    tableHeader: {
        backgroundColor: 'black',
        color: 'white'
    },
    viewLink: {
        textDecoration: 'none'
    }
})

const BillsTable = (props) => {
    const dispatch = useDispatch()
    const { bills, resetSearch } = props
    const customers = useSelector(state => state.customers)
    const classes = useStyle()

    // Load customers when component mounts
    useEffect(() => {
        dispatch(asyncGetCustomers())
    }, [dispatch])

    // Create a safe copy of bills array before reversing
    const reversedBills = Array.isArray(bills) ? [...bills].reverse() : []

    const getCustomerName = (customer) => {
        if (!customers || customers.length === 0) return 'Loading...'
        
        // If customer is already an object with name, use that
        if (typeof customer === 'object' && customer !== null && customer.name) {
            return customer.name
        }

        // If customer is an ID, find the customer
        const customerId = typeof customer === 'object' ? customer._id : customer
        const customerData = customers.find(cust => cust._id === customerId)
        
        if (!customerData) {
            console.log('Customer not found for ID:', customer)
            console.log('Available customers:', customers)
            return 'Loading...'
        }
        
        return customerData.name
    }

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure?')
        if(confirmDelete){
            dispatch(asyncDeleteBill(id))
                .then(() => {
                    dispatch(asyncGetBills())
                    resetSearch()
                })
                .catch(error => {
                    console.error('Delete failed:', error)
                    alert('Failed to delete bill. Please try again.')
                })
        }
    }

    if (!customers || customers.length === 0) {
        return (
            <TableContainer component={Paper} className={classes.table}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeader} colSpan={5} align="center">
                                <CircularProgress color="secondary" /> Loading Customers...
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        )
    }

    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader}>Date</TableCell>
                        <TableCell className={classes.tableHeader}>Order ID</TableCell>
                        <TableCell className={classes.tableHeader}>Customer Name</TableCell>
                        <TableCell className={classes.tableHeader}>Total Amount</TableCell>
                        <TableCell className={classes.tableHeader}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reversedBills.map(bill => {
                        const customerName = getCustomerName(bill.customer)
                        return (
                            <TableRow key={bill._id}>
                                <TableCell>{moment(bill.date).format('DD/MM/YYYY, hh:mm A')}</TableCell>
                                <TableCell>{bill._id}</TableCell>
                                <TableCell>{customerName}</TableCell>
                                <TableCell>{bill.total}</TableCell>
                                <TableCell>
                                    <Link to={`/bills/${bill._id}`} className={classes.viewLink}>
                                        <Button 
                                            size='small' 
                                            variant='contained' 
                                            color='primary'
                                            style={{marginRight: '10px'}}
                                        >
                                            View
                                        </Button>
                                    </Link>
                                    <Button 
                                        size='small' 
                                        variant='contained' 
                                        color='secondary'
                                        onClick={() => handleDelete(bill._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default BillsTable