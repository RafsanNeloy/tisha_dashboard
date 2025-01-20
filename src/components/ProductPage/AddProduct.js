import React from 'react'
import { Container, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ProductForm from './ProductForm'

const useStyle = makeStyles({
    title:{
        fontWeight:700
    },
    container:{
        padding: '10px 0'
    }
})

const AddProduct = (props) => {
    const classes = useStyle()

    return (
        <Container className={classes.container}>
            <Typography className={classes.title} variant='h5'>Add Product</Typography>
            <ProductForm />
        </Container>
    )
}

export default AddProduct