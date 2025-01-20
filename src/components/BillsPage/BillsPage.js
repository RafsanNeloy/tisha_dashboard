import { Container, Box, Typography, makeStyles, Grid, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import BillsTable from './BillsTable'
import SummarySection from './SummarySection'

const useStyle = makeStyles({
    title:{
        fontWeight: '700'
    },
    container: {
        width: '100vw',
        padding: '2vh 2vw',
        marginLeft: '50px',
        display: 'flex',
        flexDirection : 'row',
        justifyContent: 'center'
    },
    titleContainer:{
        width: '100%'
    },
    searchField:{
        width: '35%'
    },
    summarySection:{
        marginTop: '60px'
    },
    billTableSection: {
        // position: 'fixed',
        width: '67vw'
    }
})

const BillsPage = (props) => {
    const bills = useSelector(state => state.bills)
    const classes = useStyle()
    const [ search, setSearch ] = useState()
    const [ allBills, setAllBills ] = useState(bills)

    const handleSearch = (e) => {
        setSearch(e.target.value)
        const filteredBill = searchBill(e.target.value)
        setAllBills(filteredBill)
    }

    const searchBill = (id) => {
        if(id.length > 0) {
            return bills.filter(bill => bill._id.includes(id))
        } else {
            return bills
        }
    }

    const resetSearch = () => {
        setSearch('')
    }

    return (
        <Container className={classes.container}>
            <Grid container spacing={2}>
                <Grid className={classes.billTableSection} item lg={9} md={9} sm={12} xs={12}>
                    <Box 
                        disableGutters
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                    >
                        <Typography 
                            className={classes.title} 
                            variant='h3'
                        >
                            Bills
                        </Typography>
                        <TextField 
                            className={classes.searchField}
                            variant='outlined'
                            label='search by order id'
                            margin='dense'
                            value={search}
                            onChange={handleSearch}
                        />
                    </Box>
                    { bills.length > 0 && <BillsTable bills={allBills} resetSearch={resetSearch} /> }
                </Grid>
                <Grid className={classes.summarySection} item lg={3} md={3} sm={3} xs={3}>
                    <SummarySection />        
                </Grid>
            </Grid>
        </Container>    
    )
}

export default BillsPage 