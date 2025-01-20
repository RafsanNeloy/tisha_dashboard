import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, makeStyles, Paper, Divider, Fab, Tooltip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useSelector } from 'react-redux'

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
        let total = 0
        data.forEach(bill => total = total + bill.total)
        return total
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
                    <Typography className={classes.summaryTitle} variant='h5'>Summary</Typography>
                    <Divider variant='middle' />
                    <Box className={classes.summaryContent} display='block'>
                        <Typography variant='h6'>Total orders: {bills.length}</Typography>
                        <Typography variant='h6'>Total Amount: {calculateTotal(bills)}</Typography>
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