import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { asyncDeleteBill } from '../../action/billsAction'
import { Link } from 'react-router-dom'

const useStyle = makeStyles({
    tableHeader: {
        backgroundColor: 'black',
        color: 'white'
    },
    table: {
        maxHeight: '575px'
    },
    viewBtn: {
        textDecoration: 'none'
    }
})

const BillsTable = (props) => {
    const dispatch = useDispatch()
    const { bills, resetSearch } = props
    const customers = useSelector(state => state.customers)
    const classes = useStyle()

    // Create a safe copy of bills array before reversing
    const reversedBills = Array.isArray(bills) ? [...bills].reverse() : []

    const getCustomerName = (id) => {
        if(customers.length > 0){
            const getCustomer = customers.find(cust => cust._id === id)
            return getCustomer.name
        }
    }

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure?')
        if(confirmDelete){
            dispatch(asyncDeleteBill(id))
            resetSearch()
        }
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
                        return (
                            <TableRow key={bill._id}>
                                <TableCell>{moment(bill.date).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>{bill._id}</TableCell>
                                <TableCell>{getCustomerName(bill.customer)}</TableCell>
                                <TableCell>{bill.total}</TableCell>
                                <TableCell>
                                    <Box display='flex' flexDirection='row' justifyContent='space-evenly'>
                                        <Link to={`/bills/${bill._id}`} className={classes.viewBtn}>
                                            <Button 
                                                variant='contained' 
                                                color='primary' 
                                                size='small'
                                            >
                                                View
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant='contained' 
                                            color='secondary' 
                                            size='small'
                                            onClick={() => handleDelete(bill._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
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