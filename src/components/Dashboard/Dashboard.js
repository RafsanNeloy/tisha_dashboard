import React from 'react'
import { Container, Typography, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import StatsContainer from './StatsContainer'

const useStyle = makeStyles({
    container: {
        width: '90vw',
        padding: '2vh 1vw',
        marginLeft: '60px'
    },
    title:{
        fontWeight: '700'
    }
})

const Dashboard = (props) => {
    const classes = useStyle()

    return (
        <Container className={classes.container}>
            <Typography variant='h3' className={classes.title}>Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item lg={12}>
                    <StatsContainer />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Dashboard