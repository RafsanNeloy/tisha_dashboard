import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { asyncDeleteBill, asyncGetBills } from '../../action/billsAction'
import { asyncGetCustomers } from '../../action/customerAction'
import moment from 'moment'
import { englishToBengali, formatLargeNumber } from '../../utils/bengaliNumerals'

const useStyle = makeStyles({
    table: {
        width: '100%',
        marginTop: '5px',
        maxHeight: '70vh',
        overflow: 'auto'
    },
    tableHeader: {
        backgroundColor: 'black',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    viewLink: {
        textDecoration: 'none'
    },
    actionCell: {
        display: 'flex',
        gap: '8px'
    }
})

const BillsTable = (props) => {
    const dispatch = useDispatch()
    const { bills, resetSearch, handleDeleteBill, isAdmin } = props
    const customers = useSelector(state => state.customers)
    const classes = useStyle()
    const navigate = useNavigate()

    // Load customers when component mounts
    useEffect(() => {
        dispatch(asyncGetCustomers())
    }, [dispatch])

    // Create a safe copy of bills array before reversing
    const reversedBills = Array.isArray(bills) ? [...bills].reverse() : []

    const getCustomerName = (customer) => {
        // Early return if customer is null/undefined
        if (!customer) return 'Unknown Customer'
        
        // If customer is already an object with name, use that
        if (typeof customer === 'object' && customer.name) {
            return customer.name
        }

        // If customers array is not ready yet
        if (!customers || !Array.isArray(customers)) {
            return 'Loading...'
        }

        // If customer is an ID, find the customer
        const customerId = typeof customer === 'object' ? customer._id : customer
        if (!customerId) return 'Unknown Customer'

        const customerData = customers.find(cust => cust._id === customerId)
        return customerData?.name || 'Customer Not Found'
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

    const formatAmount = (amount) => {
        if (!amount && amount !== 0) return '০';
        return `৳${formatLargeNumber(amount)}`;
    };

    // Add validation for bills data
    if (!Array.isArray(bills) || bills.length === 0) {
        return (
            <TableContainer component={Paper} className={classes.table}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeader} colSpan={5} align="center">
                                No bills found
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
                        <TableCell className={classes.tableHeader}>Bill No</TableCell>
                        <TableCell className={classes.tableHeader}>Customer</TableCell>
                        <TableCell className={classes.tableHeader}>Bill Amount</TableCell>
                        <TableCell className={classes.tableHeader}>Wastage</TableCell>
                        <TableCell className={classes.tableHeader}>Less</TableCell>
                        <TableCell className={classes.tableHeader}>Collection</TableCell>
                        <TableCell className={classes.tableHeader}>Remaining</TableCell>
                        <TableCell className={classes.tableHeader}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bills.map((bill) => (
                        <TableRow key={bill._id}>
                            <TableCell>{new Date(bill.date).toLocaleDateString('bn-BD')}</TableCell>
                            <TableCell>{bill.billNumber}</TableCell>
                            <TableCell>{getCustomerName(bill.customer)}</TableCell>
                            <TableCell>{formatAmount(bill.total)}</TableCell>
                            <TableCell>{formatAmount(bill.wastageAmount)}</TableCell>
                            <TableCell>{formatAmount(bill.lessAmount)}</TableCell>
                            <TableCell>{formatAmount(bill.collectionAmount)}</TableCell>
                            <TableCell>{formatAmount(bill.remainingAmount)}</TableCell>
                            <TableCell className={classes.actionCell}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={() => navigate(`/bills/${bill._id}`)}
                                >
                                    View
                                </Button>
                                {isAdmin && (
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        onClick={() => handleDeleteBill(bill._id)}
                                    >
                                        remove
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default BillsTable