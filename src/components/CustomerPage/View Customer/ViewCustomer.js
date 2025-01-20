import React, { useState, useEffect, useCallback } from 'react'
import { Container, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link } from 'react-router-dom'
import CustomerStats from './CustomerStats'
import CustomerOrders from './CustomerOrders'

const useStyle = makeStyles({
    container: {
        width: '90vw',
        padding: '2vh 1vw'
    }
})

const ViewCustomer = (props) => {
    const classes = useStyle()
    const bills = useSelector(state => state.bills) || []
    const [ customerBills, setCustomerBills ] = useState([])
    const id = props.match.params.id

    const getBills = useCallback((id) => {
        if (!Array.isArray(bills)) return
        const custBills = bills.filter(bill => bill.customer === id)
        handleCustomerBills(custBills)
    }, [bills])

    useEffect(() => {
        getBills(id)
    }, [getBills, id])

    const handleCustomerBills = (data) => {
        setCustomerBills(data)
    }

    return (
        <Container className={classes.container}>
            <Link to='/customers'>
                <IconButton size='medium'>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            <CustomerStats id={props.match.params.id} customerBills={customerBills} />
            <CustomerOrders customerBills={customerBills} />
        </Container>
    )
}

export default ViewCustomer