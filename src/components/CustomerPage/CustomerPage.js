import { Container, Typography, makeStyles, Box, Divider, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { asyncGetCustomers } from '../../action/customerAction'
import EditCustomer from './EditCustomer'
import AddCustomer from './AddCustomer'
import CustomerTable from './CustomerTable'

const useStyle = makeStyles({
    container: {
        width: '100vw',
        padding: '2vh 2vw',
        marginLeft: '50px',
        display: 'flex',
        flexDirection : 'row',
        justifyContent: 'center'
    },
    title:{
        fontWeight: '700'
    },
    tableContainer:{
        position: 'fixed',
        marginTop: '175px'
    }, 
    divider:{
        width: '90vw'
    },
    tableContainerTitle:{
        width: '90vw'
    },
    searchField:{
        width: '35%'
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
                        alignItems='baseline' 
                        justifyContent='space-between' 
                        className={classes.tableContainerTitle} 
                    >
                        <Typography variant='h5'>List of Customers - {customers.length}</Typography>
                        <TextField 
                            className={classes.searchField} 
                            variant='outlined' 
                            margin='dense' 
                            value={search}
                            label='search customer by name, mobile or email' 
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