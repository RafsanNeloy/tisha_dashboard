import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, IconButton, Typography, Box, Tooltip, Link, CircularProgress, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch } from 'react-redux'
import { asyncGetBillDetail } from '../../../action/billsAction'
import { asyncGetCustomers } from '../../../action/customerAction'
import { asyncGetProducts } from '../../../action/productAction'
import BillDetail from './BillDetail'
import BillItemtable from './BillItemTable'
import PrintBill from './PrintBill'
import axios from 'axios'

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
    const [bill, setBill] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    navigate('/login-or-register')
                    return
                }
                
                const response = await axios.get(`http://localhost:5001/api/bills/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log('Bill additionalPrice check:', {
                    hasField: 'additionalPrice' in response.data,
                    value: response.data.additionalPrice,
                    billTotal: response.data.total,
                    subtotal: response.data.items?.reduce((sum, item) => sum + item.subTotal, 0) || 0
                })

                setBill(response.data)
                console.log('Received bill data:', response.data)
            } catch (err) {
                console.error('Error fetching bill:', err)
                setError(err.response?.data?.message || 'Error loading bill')
                if (err.response?.status === 401) {
                    navigate('/login-or-register')
                }
            }
        }
        fetchBill()
    }, [id, navigate])

    const handleAddressChange = (address) => {
        setBill(prevBill => ({
            ...prevBill,
            customer: {
                ...prevBill.customer,
                address: address
            }
        }))
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
                <Button onClick={() => navigate('/bills')}>Back to Bills</Button>
            </Container>
        )
    }

    if (!bill) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        )
    }

    const additionalPrice = bill?.additionalPrice || 0;

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
                    bill={bill} 
                    customer={bill.customer}
                    customerAddress={bill.customer?.address || ''} 
                    items={bill.items || []} 
                />
            </Box>
            <Typography variant='h5' align='center'><strong>বিল ইনভয়েস</strong></Typography>
            <BillDetail 
                id={id} 
                bill={bill} 
                customer={bill.customer}
                onAddressChange={handleAddressChange}
            />
            {bill.items && bill.items.length > 0 && (
                <BillItemtable 
                    items={bill.items.map(item => ({
                        ...item,
                        product: item.product._id,
                        name: item.product.name
                    }))} 
                    total={bill.total}
                    additionalPrice={bill.additionalPrice || 0}
                    bill={bill}
                />
            )}
        </Container>
    )
}

export default BillView