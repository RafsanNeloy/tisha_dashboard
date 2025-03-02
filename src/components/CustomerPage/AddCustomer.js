import React, { useEffect } from 'react'
import { Container, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CustomerForm from './CustomerForm'
import { useNavigate } from 'react-router-dom'

import { checkAuthAndRedirect } from '../../utils/authUtils'

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
    const navigate = useNavigate()

    useEffect(() => {
        checkAuthAndRedirect(navigate, () => navigate('/customers'))
    }, [navigate])

    return (
        <Container className={classes.container}>
            <Typography className={classes.title} variant='h5'>Add Customer</Typography>
            <CustomerForm 
                handleClose={props.handleClose}
            />
        </Container>
    )
}

export default AddCustomer