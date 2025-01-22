import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'

const useStyle = makeStyles({
    tableHeaderFooter: {
        color: 'black',
        fontWeight: 600
    }
})

const ViewOrderTable = (props) => {
    const { lineItems, total } = props
    const products = useSelector(state => state.products)
    const classes = useStyle()

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaderFooter}>S.No</TableCell>
                        <TableCell className={classes.tableHeaderFooter}>Product Name</TableCell>
                        <TableCell className={classes.tableHeaderFooter}>Price</TableCell>
                        <TableCell className={classes.tableHeaderFooter}>Quantity</TableCell>
                        <TableCell className={classes.tableHeaderFooter}>Sub Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lineItems.map((item, index) => {
                        if (!item || !item.product) return null;

                        return (
                            <TableRow key={item._id || index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.subTotal}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className={classes.tableHeaderFooter}>Total Amount</TableCell>
                        <TableCell className={classes.tableHeaderFooter}>{total}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default ViewOrderTable