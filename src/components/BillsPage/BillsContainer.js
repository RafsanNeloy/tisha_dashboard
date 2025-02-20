import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, TextField, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetCustomers } from '../../action/customerAction'
import { asyncGetBills, asyncDeleteBill } from '../../action/billsAction'
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

const BillsContainer = ({ isAdmin }) => {
    const bills = useSelector(state => state.bills) || []
    const classes = useStyle()
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [filteredBills, setFilteredBills] = useState([])

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
        // Update filteredBills when bills change
        setFilteredBills(Array.isArray(bills) ? bills : [])
    }, [bills])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        const filtered = searchBill(e.target.value)
        setFilteredBills(filtered)
    }

    const searchBill = (searchTerm) => {
        if (!Array.isArray(bills)) return []
        if (searchTerm.length > 0) {
            return bills.filter(bill => 
                bill.billNumber.toString().includes(searchTerm) || 
                bill._id.includes(searchTerm)
            )
        }
        return bills
    }

    const handleDeleteBill = (id) => {
        const confirmDelete = window.confirm('Are you sure?')
        if(confirmDelete){
            dispatch(asyncDeleteBill(id))
                .then(() => {
                    dispatch(asyncGetBills())
                    setSearch('')
                })
                .catch(error => {
                    console.error('Delete failed:', error)
                    alert('Failed to delete bill. Please try again.')
                })
        }
    }

    const resetSearch = () => {
        setSearch('')
        setFilteredBills(bills)
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
                    <BillsTable 
                        bills={filteredBills} 
                        handleDeleteBill={handleDeleteBill}
                        resetSearch={resetSearch}
                        isAdmin={isAdmin}
                    />
                </Grid>
                <Grid className={classes.summarySection} item lg={3} md={3} sm={12} xs={12}>
                    <SummarySection />        
                </Grid>
            </Grid>
        </Container>    
    )
}

export default BillsContainer 