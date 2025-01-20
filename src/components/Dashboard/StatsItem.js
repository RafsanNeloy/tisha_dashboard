import React from 'react'
import { Paper, Typography, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyle = makeStyles({
    statItem: {
        backgroundColor: ''
    }
})

const StatsItem = (props) => {
    const { statTitle, statNumber } = props
    const classes = useStyle()

    return (
        <Grid item lg={4} md={4} sm={4} xs={6}>
            <Paper elevation={2} className={classes.statItem}>
                <Typography variant='h6' align='center'> {statTitle} </Typography>  
                <Typography variant='h2' align='center'> {statNumber} </Typography>  
            </Paper>
        </Grid>
    )
}

export default StatsItem