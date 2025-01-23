import React from 'react'
import { Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import StatsItem from './StatsItem'
import moment from 'moment'
import { englishToBengali } from '../../utils/bengaliNumerals'

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
        if (!Array.isArray(data)) return '০'
        const total = data.reduce((total, bill) => total + (bill.total || 0), 0)
        return englishToBengali(total)
    }

    return(
        <>
            <Typography variant='h6' className={classes.statsHeader}>Overall Stats</Typography>
            <Grid container spacing={6}>
                    <StatsItem statTitle={'মোট গ্রাহক'} statNumber={englishToBengali(customers.length)} />
                    <StatsItem statTitle={'মোট পণ্য'} statNumber={englishToBengali(products.length)} />
                    <StatsItem statTitle={'মোট অর্ডার'} statNumber={englishToBengali(bills.length)} />
            </Grid>
            <Typography variant='h6' className={classes.statsHeader}>Daily Stats</Typography>
            <Grid container spacing={6}>
                    <StatsItem statTitle={'আজকের অর্ডার'} statNumber={englishToBengali(todayBills.length)} />
                    <StatsItem statTitle={'আজকের আয়'} statNumber={calculateTotal(todayBills)} />
                    <StatsItem statTitle={'মোট আয়'} statNumber={calculateTotal(bills)} />
            </Grid>
        </>
    )
}

export default StatsContainer