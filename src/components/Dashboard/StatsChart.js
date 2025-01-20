import { Grid } from '@material-ui/core'
import React from 'react'
import BarChart from './BarChart'
import LineChart from './LineChart'

const StatsChart = (props) => {

    return (
        <>
            <Grid container spacing={6}>
                <Grid item lg={6}>
                    <LineChart />
                </Grid>
                <Grid item lg={6}>
                    <BarChart />
                </Grid>
            </Grid>
        </>
    )
}

export default StatsChart