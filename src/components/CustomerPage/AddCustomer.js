import React from 'react'
import { Container, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CustomerForm from './CustomerForm'

const useStyle = makeStyles({
    title:{
        fontWeight:700
    },
    container:{
        padding: '10px 0'
    }
})

const AddCustomer = (props) => {
    const classes = useStyle()

    return (
        <Container className={classes.container}>
            <Typography className={classes.title} variant='h5'>Add Customer</Typography>
            <CustomerForm />
        </Container>
    )
}

export default AddCustomer