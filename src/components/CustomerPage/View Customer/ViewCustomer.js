import React, { useState, useEffect } from 'react'
import { Container, IconButton, CircularProgress, Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useDispatch } from 'react-redux'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useParams } from 'react-router-dom'
import CustomerStats from './CustomerStats'
import CustomerOrders from './CustomerOrders'
import axios from 'axios'

const useStyle = makeStyles({
    container: {
        width: '90vw',
        padding: '2vh 1vw'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
    }
})

const ViewCustomer = () => {
    const classes = useStyle()
    const [customerData, setCustomerData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const fetchCustomerData = async () => {
            setIsLoading(true)
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('No authentication token found')
                }

                const response = await axios.get(`https://tisha-dashboard-api.onrender.com//api/customers/${id}/bills`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                setCustomerData(response.data)
            } catch (err) {
                console.error('Error details:', err.response || err)
                setError(err.response?.data?.message || 'Could not fetch customer data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCustomerData()
    }, [id])

    if (isLoading) {
        return (
            <Container className={classes.container}>
                <Box className={classes.loading}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

    if (error) {
        return (
            <Container className={classes.container}>
                <Typography color="error" variant="h6" align="center">
                    {error}
                </Typography>
            </Container>
        )
    }

    return (
        <Container className={classes.container}>
            <Link to='/customers'>
                <IconButton size='medium'>
                    <ArrowBackIcon />
                </IconButton>
            </Link>
            <CustomerStats 
                customer={customerData?.customer}
                stats={customerData?.stats}
            />
            <CustomerOrders bills={customerData?.bills || []} />
        </Container>
    )
}

export default ViewCustomer