import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Container, IconButton, Typography, Box, Tooltip, Link, CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch } from 'react-redux'
import { asyncGetBillDetail } from '../../../action/billsAction'
import { asyncGetCustomers } from '../../../action/customerAction'
import { asyncGetProducts } from '../../../action/productAction'
import BillDetail from './BillDetail'
import BillItemtable from './BillItemTable'
import PrintBill from './PrintBill'

const useStyle = makeStyles({
    container: {
        width: '90vw',
        padding: '2vh 1vw'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
    }
})

const BillView = () => {
    const classes = useStyle()
    const { id } = useParams()
    const [billDetails, setBillDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [customerAddress, setCustomerAddress] = useState('')
    const dispatch = useDispatch()

    const handleBillDetails = useCallback((data) => {
        if (data) {
            setBillDetails(data)
            setCustomerAddress(data.customer?.address || '')
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        const fetchBillDetails = async () => {
            setIsLoading(true)
            setError(null)
            try {
                await dispatch(asyncGetBillDetail(id, handleBillDetails))
            } catch (err) {
                console.error('Error fetching bill:', err)
                setError(err.message || 'Failed to load bill details')
                setIsLoading(false)
            }
        }

        if (id) {
            fetchBillDetails()
        }
    }, [dispatch, id, handleBillDetails])

    const handleAddressChange = (address) => {
        setCustomerAddress(address)
    }

    if (isLoading) {
        return (
            <Container className={classes.loadingContainer}>
                <CircularProgress />
            </Container>
        )
    }

    if (error) {
        return (
            <Container className={classes.container}>
                <Typography color="error" align="center">
                    {error}
                </Typography>
            </Container>
        )
    }

    if (!billDetails || !billDetails.items) {
        return (
            <Container className={classes.container}>
                <Typography color="error" align="center">
                    Bill not found or has no items
                </Typography>
            </Container>
        )
    }

    return (
        <Container className={classes.container}>
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Tooltip title='Go back to bills page'>
                    <Link to='/bills'>
                        <IconButton size='medium'>
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                </Tooltip>
                <PrintBill 
                    id={id} 
                    bill={billDetails} 
                    customer={billDetails.customer}
                    customerAddress={customerAddress} 
                    items={billDetails.items || []} 
                />
            </Box>
            <Typography variant='h5' align='center'><strong>বিল ইনভয়েস</strong></Typography>
            <BillDetail 
                id={id} 
                bill={billDetails} 
                customer={billDetails.customer}
                onAddressChange={handleAddressChange}
            />
            {billDetails.items && billDetails.items.length > 0 && (
                <BillItemtable 
                    items={billDetails.items.map(item => ({
                        ...item,
                        product: item.product._id,
                        name: item.product.name
                    }))} 
                    total={billDetails.total} 
                />
            )}
        </Container>
    )
}

export default BillView