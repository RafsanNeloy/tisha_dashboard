import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, makeStyles } from '@material-ui/core'
import { asyncDeleteCustomer } from '../../action/customerAction'

const useStyle = makeStyles({
    table: {
        position: 'fixed',
        width: '90vw',
        marginTop: '5px',
        maxHeight: '380px'
    },
    nameColumn:{
        width: '25%'
    },
    emailColumn:{
        width: '25%'
    },
    tableBtns:{
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-evenly'
    },
    tableHeader: {
        backgroundColor: 'black',
        color: 'white'
    },
    headerName: {
        color:'white'
    },
    viewLink: {
        textDecoration: 'none'
    }
})

const CustomerTable = (props) => {
    const { handleUpdateCustomer, customers, resetSearch } = props
    const dispatch = useDispatch()
    const classes = useStyle()

    return (
        <TableContainer component={Paper} className={classes.table} >
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader} align='center'>ID</TableCell>
                        <TableCell className={`${classes.nameColumn} ${classes.tableHeader}`} align='center'>Customer Name</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>Mobile</TableCell>
                        <TableCell className={`${classes.emailColumn} ${classes.tableHeader}`} align='center'>Email</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>View</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        customers.map((cust, index) => {
                            return (
                                <TableRow hover key={cust._id}>
                                    <TableCell> {index + 1} </TableCell>
                                    <TableCell> {cust.name} </TableCell>
                                    <TableCell> {cust.mobile} </TableCell>
                                    <TableCell> {cust.email} </TableCell>
                                    <TableCell align='center'> 
                                        <Link to={`/customers/${cust._id}`} className={classes.viewLink}>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                            >
                                                View
                                            </Button>
                                        </Link> 
                                    </TableCell>
                                    <TableCell className={classes.tableBtns} align='center'> 
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                onClick={() => {
                                                    handleUpdateCustomer(cust)
                                                    resetSearch()
                                                }}
                                            >
                                                Update
                                            </Button> 
                                            <Button
                                                variant='contained'
                                                color='secondary'
                                                onClick={() => {
                                                    dispatch(asyncDeleteCustomer(cust._id))
                                                    resetSearch()
                                                }}
                                            >
                                                Remove
                                            </Button> 
                                        </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CustomerTable