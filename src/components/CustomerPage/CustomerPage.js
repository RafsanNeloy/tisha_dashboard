import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Divider, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetCustomers } from '../../action/customerAction'
import EditCustomer from './EditCustomer'
import AddCustomer from './AddCustomer'
import CustomerTable from './CustomerTable'

const useStyle = makeStyles({
    container: {
        width: '100%',
        padding: '2rem',
        marginLeft: '50px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: '2rem'
    },
    title: {
        fontWeight: '700',
        marginBottom: '1.5rem'
    },
    tableContainer: {
        position: 'fixed',
        marginTop: '175px',
        maxWidth: '1200px',
        width: '100%'
    },
    divider: {
        width: '100%',
        margin: '2rem 0'
    },
    tableContainerTitle: {
        width: '100%',
        marginBottom: '1rem',
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        borderRadius: '8px'
    },
    searchField: {
        width: '350px',
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff'
        }
    }
})

const CustomerPage = (props) => {
    const classes = useStyle()
    const customers = useSelector(state => state.customers)
    const dispatch = useDispatch()
    const [ search, setSearch ] = useState('')
    const [ customerList, setCustomerList ] = useState(customers)
    const [ updateCust, setUpdateCust ] = useState({})

    useEffect(() => {
        setCustomerList(customers)
    }, [customers])

    useEffect(() => {
        dispatch(asyncGetCustomers())
    }, [dispatch])

    const filterCustomers = (value) => {
        if(value.length > 0) {
            const filteredCustomer = customers.filter(ele => {
                return ele.name.toLowerCase().includes(value.toLowerCase()) || ele.mobile.includes(value) || ele.email.toLowerCase().includes(value.toLowerCase())
            })
            setCustomerList(filteredCustomer)
        } else {
            setCustomerList(customers)
        }
    } 

    const handleUpdateCustomer = (data) => {
        setUpdateCust(data)
    }

    const resetUpdateCust = () => {
        setUpdateCust({})
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        filterCustomers(e.target.value)
    }

    const resetSearch = () => {
        setSearch('')
        filterCustomers('')
    }

    return (
        <Container className={classes.container} >
            <Container disableGutters>
                <Typography className={classes.title} variant='h3'>Customers</Typography>
                {
                    Object.keys(updateCust).length > 0 ? (
                        <EditCustomer updateCust={updateCust} resetUpdateCust={resetUpdateCust} />
                    ) : (
                        <AddCustomer />
                    )
                }
                <Divider className={classes.divider} />
            </Container>
            
            <Box className={classes.tableContainer}>
                <Box 
                    disableGutters 
                    display='flex' 
                    flexDirection='row' 
                    alignItems='center'
                    justifyContent='space-between' 
                    className={classes.tableContainerTitle} 
                >
                    <Typography 
                        variant='h5' 
                        sx={{ 
                            fontWeight: 500,
                            color: '#1a237e'
                        }}
                    >
                        List of Customers - {customers.length}
                    </Typography>
                    <TextField 
                        className={classes.searchField} 
                        variant='outlined' 
                        size="small"
                        value={search}
                        label='Search customer by name, mobile or email' 
                        onChange={handleSearchChange}
                    />
                </Box>
                <CustomerTable 
                    customers={customerList}
                    resetSearch={resetSearch}
                    handleUpdateCustomer={handleUpdateCustomer}
                />
            </Box>
        </Container>
    )
}

export default CustomerPage