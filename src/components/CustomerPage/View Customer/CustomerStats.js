import React from 'react'
import { Container, Grid, Paper, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
 
const useStyle = makeStyles({
    custDetail: {
        padding: '16px 0'
    }
})

const CustomerStats = (props) => {
    const { customer, stats } = props
    const classes = useStyle()

    if (!customer || !stats) {
        return null
    }

    return (
        <Grid container spacing={2}>
            <Grid item lg={4}>
                <Paper className={classes.custDetail}>
                    <Container>
                        <Typography variant='body1'><strong>Name: </strong>{customer.name}</Typography>
                        <Typography variant='body1'><strong>Email: </strong>{customer.email}</Typography>
                        <Typography variant='body1'><strong>Mobile: </strong>{customer.mobile}</Typography>
                    </Container>
                </Paper>
            </Grid>
            <Grid item lg={4}>
                <Paper>
                    <Typography variant='h6' align='center'>Total Orders</Typography>
                    <Typography variant='h2' align='center'>{stats.totalOrders}</Typography>
                </Paper>
            </Grid>
            <Grid item lg={4}>
                <Paper>
                    <Typography variant='h6' align='center'>Total Amount of Purchase</Typography>
                    <Typography variant='h2' align='center'>{stats.totalAmount}</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default CustomerStats