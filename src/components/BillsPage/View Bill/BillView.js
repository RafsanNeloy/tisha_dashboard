import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Container, IconButton, Typography, Box, Tooltip, Link, CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
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
    const customers = useSelector(state => state.customers)
    const products = useSelector(state => state.products)
    const [billDetails, setBillDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const dispatch = useDispatch()

    // Load required data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                await Promise.all([
                    dispatch(asyncGetProducts())
                ])
            } catch (err) {
                setError('Failed to load required data')
                setIsLoading(false)
            }
        }
        loadData()
    }, [dispatch])

    const handleBillDetails = useCallback((data) => {
        console.log('Bill Details received:', data)
        setBillDetails(data)
        setIsLoading(false)
    }, [])
    
    useEffect(() => {
        if (products.length > 0) {
            console.log('Fetching bill details for ID:', id)
            dispatch(asyncGetBillDetail(id, handleBillDetails))
                .catch(err => {
                    console.error('Error fetching bill:', err)
                    setError(err.message || 'Failed to load bill details')
                    setIsLoading(false)
                })
        }
    }, [dispatch, id, handleBillDetails, products.length])

    if (isLoading || !products.length) {
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

    if (!billDetails) {
        return (
            <Container className={classes.container}>
                <Typography color="error" align="center">
                    Bill not found
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
                    items={billDetails.items} 
                />
            </Box>
            <Typography variant='h5' align='center'><strong>Bill Invoice</strong></Typography>
            <BillDetail 
                id={id} 
                bill={billDetails} 
                customer={billDetails.customer} 
            />
            <BillItemtable 
                items={billDetails.items.map(item => ({
                    ...item,
                    product: item.product._id,
                    name: item.product.name
                }))} 
                total={billDetails.total} 
            />
        </Container>
    )
}

export default BillView