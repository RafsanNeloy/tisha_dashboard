import { Grid, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import StatsItem from './StatsItem'
import moment from 'moment'

const useStyle = makeStyles({
    statsHeader: {
        fontWeight: 700
    }
})

const StatsContainer = (props) => {
    const products = useSelector(state => state.products)
    const customers = useSelector(state => state.customers)
    const bills = useSelector(state => state.bills)
    const classes = useStyle()

    const todayBills = bills.filter(bill => moment(bill.createdAt).isBetween(moment().startOf('days'), moment()))

    const calculateTotal = (data) => {
        let total = 0
        data.forEach(bill => {
            total = bill.total + total
        })
        return total
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