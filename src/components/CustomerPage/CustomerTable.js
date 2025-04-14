import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { asyncDeleteCustomer } from '../../action/customerAction'
import { makeStyles } from '@mui/styles'
import Swal from 'sweetalert2'

const useStyle = makeStyles({
    table: {
        width: '90vw',
        marginTop: '10px',
        marginBottom: '50px',
        maxHeight: '480px',
        overflowY: 'auto'
    },
    tableContainer: {
        maxHeight: 540,
        overflowY: 'auto',
        marginBottom: '50px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    tableScroll: {
        maxHeight: 480,
        overflowY: 'auto'
    },
    nameColumn: {
        width: '25%'
    },
    emailColumn: {
        width: '25%'
    },
    tableBtns: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    tableHeader: {
        backgroundColor: 'black',
        color: 'white'
    },
    headerName: {
        color: 'white'
    },
    viewLink: {
        textDecoration: 'none'
    }
})

const CustomerTable = (props) => {
    const { handleUpdateCustomer, customers, resetSearch } = props
    const dispatch = useDispatch()
    const classes = useStyle()
    const { user } = useSelector(state => state.auth)

    const handleDelete = (id) => {
        if (user.role === 'admin') {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(asyncDeleteCustomer(id))
                        .then(() => {
                            resetSearch();
                            Swal.fire(
                                'Deleted!',
                                'Customer has been deleted.',
                                'success'
                            );
                        })
                        .catch((error) => {
                            Swal.fire(
                                'Error!',
                                'Failed to delete customer.',
                                'error'
                            );
                        });
                }
            });
        }
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'mobile', headerName: 'Mobile', flex: 1 },
        { field: 'address', headerName: 'Address', flex: 2 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'view', headerName: 'View', flex: 1 },
        { field: 'details', headerName: 'Details', flex: 1 },
        { field: 'action', headerName: 'Action', flex: 1 },
    ]

    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
            <div className={classes.tableScroll}>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeader} align='center'>ID</TableCell>
                            <TableCell className={`${classes.nameColumn} ${classes.tableHeader}`} align='center'>Customer Name</TableCell>
                            <TableCell className={classes.tableHeader} align='center'>Mobile</TableCell>
                            <TableCell className={classes.tableHeader} align='center'>Address</TableCell>
                            <TableCell className={classes.tableHeader} align='center'>Email</TableCell>
                            <TableCell className={classes.tableHeader} align='center'>View</TableCell>
                            <TableCell className={classes.tableHeader} align='center'>Details</TableCell>
                            {user.role === 'admin' && (
                                <TableCell className={classes.tableHeader} align='center'>Action</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((cust, index) => {
                            const canModify = user.role === 'admin' || 
                                cust.user?.toString() === user._id?.toString();

                            return (
                                <TableRow hover key={cust._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{cust.name}</TableCell>
                                    <TableCell>{cust.mobile}</TableCell>
                                    <TableCell>{cust.address}</TableCell>
                                    <TableCell>{cust.email}</TableCell>
                                    <TableCell align='center'>
                                        <Link to={`/customers/${cust._id}`} className={classes.viewLink}>
                                            <Button variant='contained' color='primary'>
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Link to={`/customer-details/${cust._id}`} className={classes.viewLink}>
                                            <Button variant='contained' color='primary'>
                                                Details
                                            </Button>
                                        </Link>
                                    </TableCell>
                                    {user.role === 'admin' && (
                                        <TableCell className={classes.tableBtns} align='center'>
                                            {canModify && (
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
                                            )}
                                            <Button
                                                variant='contained'
                                                color='secondary'
                                                onClick={() => handleDelete(cust._id)}
                                                style={{ marginLeft: '8px' }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </TableContainer>
    )
}

export default CustomerTable