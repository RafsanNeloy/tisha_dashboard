import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Paper, Divider, Fab, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import { useSelector } from 'react-redux'
import { formatLargeNumber } from '../../utils/bengaliNumerals'

const useStyle = makeStyles({
    summaryTitle:{
        textAlign: 'center',
        fontWeight: 600
    },
    summaryContainer:{
        height: '40vh'
    },
    summaryContent:{
        height: '40%',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'space-evenly'
    },
    summary:{
        height: '85vh'
    },
    addIcon:{
        position: 'fixed',
        bottom: "50px",
        right: '60px'
    }
})

const SummarySection = (props) => {
    const classes = useStyle()
    const bills = useSelector(state => state.bills)

    const calculateTotal = (data) => {
        if (!Array.isArray(data)) return '০';
        const total = data.reduce((sum, bill) => sum + (Number(bill.total) || 0), 0);
        return `৳${formatLargeNumber(total)}`;
    }

    return (
        <Box 
            className={classes.summary}
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
        >
            <Box>
                <Paper className={classes.summaryContainer}>
                    <Typography className={classes.summaryTitle} variant='h5'>সারসংক্ষেপ</Typography>
                    <Divider variant='middle' />
                    <Box className={classes.summaryContent} display='block'>
                        <Typography variant='h6'>মোট অর্ডার: {formatLargeNumber(bills.length)}</Typography>
                        <Typography variant='h6'>মোট টাকা: {calculateTotal(bills)}</Typography>
                    </Box>
                </Paper>
            </Box>
            
                <Link to='/addBill'>
                    <Tooltip title='Add New Bill'>
                        <Fab className={classes.addIcon} color='primary'>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Link>
        </Box>
    )
}

export default SummarySection