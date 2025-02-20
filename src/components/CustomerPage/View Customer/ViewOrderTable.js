import React, { memo } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyle = makeStyles({
    table: {
        minWidth: 650
    },
    tableHeader: {
        backgroundColor: '#f5f5f5'
    }
});

const ViewOrderTable = memo(({ lineItems, total }) => {
    const classes = useStyle()

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader}>Product Name</TableCell>
                        <TableCell className={classes.tableHeader} align="right">Price</TableCell>
                        <TableCell className={classes.tableHeader} align="right">Quantity</TableCell>
                        <TableCell className={classes.tableHeader} align="right">Subtotal</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lineItems.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.product.name}</TableCell>
                            <TableCell align="right">{item.price}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{item.subTotal}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={3} align="right"><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>{total}</strong></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
});

export default ViewOrderTable