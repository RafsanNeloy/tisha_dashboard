import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, TextField, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetCustomers } from '../../action/customerAction'
import { asyncGetBills } from '../../action/billsAction'
import BillsTable from './BillsTable'
import SummarySection from './SummarySection'

const useStyle = makeStyles({
    title: {
        fontWeight: '700'
    },
    container: {
        width: '100%',
        padding: '2vh 2vw',
        marginLeft: '0',
    },
    searchField: {
        width: '35%'
    },
    summarySection: {
        marginTop: '20px'
    },
    billTableSection: {
        width: '100%'
    }
})

const BillsPage = (props) => {
    const bills = useSelector(state => state.bills) || []
    const classes = useStyle()
    const dispatch = useDispatch()
    const [ search, setSearch ] = useState('')
    const [ allBills, setAllBills ] = useState([])

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    dispatch(asyncGetBills()),
                    dispatch(asyncGetCustomers())
                ])
            } catch (error) {
                console.error('Error loading data:', error)
            }
        }
        loadData()
    }, [dispatch])

    useEffect(() => {
        // Update allBills when bills change
        setAllBills(Array.isArray(bills) ? bills : [])
    }, [bills])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        const filteredBill = searchBill(e.target.value)
        setAllBills(filteredBill)
    }

    const searchBill = (id) => {
        if (!Array.isArray(bills)) return []
        if (id.length > 0) {
            return bills.filter(bill => bill._id.includes(id))
        }
        return bills
    }

    const resetSearch = () => {
        setSearch('')
    }

    return (
        <Container className={classes.container}>
            <Grid container spacing={2}>
                <Grid className={classes.billTableSection} item lg={9} md={9} sm={12} xs={12}>
                    <Box 
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={2}
                    >
                        <Typography 
                            className={classes.title} 
                            variant='h3'
                        >
                            Bills
                        </Typography>
                        <TextField 
                            className={classes.searchField}
                            variant='outlined'
                            label='search by order id'
                            margin='dense'
                            value={search}
                            onChange={handleSearch}
                        />
                    </Box>
                    { bills.length > 0 && <BillsTable bills={allBills} resetSearch={resetSearch} /> }
                </Grid>
                <Grid className={classes.summarySection} item lg={3} md={3} sm={12} xs={12}>
                    <SummarySection />        
                </Grid>
            </Grid>
        </Container>    
    )
}

export default BillsPage 