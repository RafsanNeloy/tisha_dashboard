import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import ProductSuggestion from './ProductSuggestion'
import ProductListTable from './ProductListTable'
import SummaryOfBill from './SummaryOfBill'
import AddCustomerModal from './AddCustomerModal'
import Swal from 'sweetalert2'
import { checkAuthAndRedirect } from '../../../utils/authUtils'

const useStyle = makeStyles({
    title:{
        fontWeight: '700'
    },
    container: {
        width: '90vw',
        padding: '2vh 1vw'
    },
    gridContainer: {
        height: '85vh'
    }
})

const AddBill = (props) => {
    const classes = useStyle()
    const navigate = useNavigate()
    const [ lineItems, setLineItems ] = useState([])
    const [ customerInfo, setCustomerInfo ] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        checkAuthAndRedirect(navigate, () => navigate('/bills'))
    }, [navigate])

    // functions related to lineitems
    const handleAddLineItem = (data) => {
        const newList = [...lineItems, data]
        setLineItems(newList)
    }

    const handleRemoveLineItem = (data) => {
        const newList = lineItems.filter(product => product._id !== data._id)
        setLineItems(newList)
    }

    const handleChangeQuantity = (data, type) => {
        if(type === 'add') {
            const newQuantityPlus = {...data, quantity: data.quantity + 1}
            newQuantityPlus.subTotal = newQuantityPlus.price * newQuantityPlus.quantity
            const newList = lineItems.map(product => {
                if(product._id === newQuantityPlus._id) {
                    return newQuantityPlus
                } else {
                    return product
                }
            })
            setLineItems(newList)
        } else if(type === 'minus') {
            const newQuantityMinus = {...data, quantity: data.quantity - 1}
            newQuantityMinus.subTotal = newQuantityMinus.price * newQuantityMinus.quantity
            const newList = lineItems.map(product => {
                if(product._id === newQuantityMinus._id) {
                    return newQuantityMinus
                } else {
                    return product
                }
            })
            setLineItems(newList)
        } else if(type === 'set') {
            // Handle direct quantity input
            const newList = lineItems.map(product => {
                if(product._id === data._id) {
                    return data
                } else {
                    return product
                }
            })
            setLineItems(newList)
        }
    }

    // function related to customerInfo
    const handleCustomerInfo = (value) => {
        setCustomerInfo(value)
    }

    const handleGenerateBillError = (error) => {
        Swal.fire({
            icon: 'error',
            title: 'Bill Generation Failed',
            text: error.response?.data?.message || 'Please check all required fields and try again',
        })
    }

    const handleBillSuccess = (billId) => {
        Swal.fire({
            icon: 'success',
            title: 'Bill Generated Successfully',
            showConfirmButton: false,
            timer: 1500
        })
        navigate(`/bills/${billId}`)
    }

    return (
        <Container className={classes.container}>
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Typography 
                    className={classes.title} 
                    variant='h3'
                >
                    New Bill
                </Typography>
                <AddCustomerModal />
            </Box>
            <Grid className={classes.gridContainer} container spacing={2}>
                <Grid item lg={9} md={9} sm={12}>
                    <ProductSuggestion handleAddLineItem={handleAddLineItem} />
                    <ProductListTable 
                        items={lineItems} 
                        handleChangeQuantity={handleChangeQuantity}
                        handleRemoveLineItem={handleRemoveLineItem}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={12}>
                    <SummaryOfBill 
                        handleCustomerInfo={handleCustomerInfo} 
                        lineItems={lineItems} 
                        customerInfo={customerInfo}
                        onGenerateError={handleGenerateBillError}
                        onGenerateSuccess={handleBillSuccess}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default AddBill