import React from 'react'
import { Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import StatsItem from './StatsItem'
import moment from 'moment'

const useStyle = makeStyles({
    statsHeader: {
        fontWeight: 700
    }
})

const StatsContainer = (props) => {
    const products = useSelector(state => state.products) || []
    const customers = useSelector(state => state.customers) || []
    const bills = useSelector(state => state.bills) || []
    const classes = useStyle()

    const todayBills = Array.isArray(bills) ? bills.filter(bill => 
        moment(bill.createdAt).isBetween(moment().startOf('days'), moment())
    ) : []

    const calculateTotal = (data) => {
        if (!Array.isArray(data)) return 0
        return data.reduce((total, bill) => total + (bill.total || 0), 0)
    }

    return(
        <>
            <Typography variant='h6' className={classes.statsHeader}>Overall Stats</Typography>
            <Grid container spacing={6}>
                    <StatsItem statTitle={'Total Customers'} statNumber={customers.length} />
                    <StatsItem statTitle={'Total Products'} statNumber={products.length} />
                    <StatsItem statTitle={'Total Orders'} statNumber={bills.length} />
            </Grid>
            <Typography variant='h6' className={classes.statsHeader}>Daily Stats</Typography>
            <Grid container spacing={6}>
                    <StatsItem statTitle={'Orders received today'} statNumber={todayBills.length} />
                    <StatsItem statTitle={'Amount received today'} statNumber={calculateTotal(todayBills)} />
                    <StatsItem statTitle={'Overall Amount'} statNumber={calculateTotal(bills)} />
            </Grid>
        </>
    )
}

export default StatsContainer