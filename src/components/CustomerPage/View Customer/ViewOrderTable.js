import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import { englishToBengali } from '../../../utils/bengaliNumerals'

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
                        <TableCell>ক্রমিক</TableCell>
                        <TableCell>পণ্যের নাম</TableCell>
                        <TableCell>দাম</TableCell>
                        <TableCell>পরিমাণ</TableCell>
                        <TableCell>মোট</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lineItems.map((item, index) => {
                        if (!item || !item.product) return null;

                        return (
                            <TableRow key={item._id || index}>
                                <TableCell>{englishToBengali(index + 1)}</TableCell>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>৳{englishToBengali(item.price)}</TableCell>
                                <TableCell>{englishToBengali(item.quantity)}</TableCell>
                                <TableCell>৳{englishToBengali(item.subTotal)}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className={classes.tableHeaderFooter}>মোট টাকা</TableCell>
                        <TableCell className={classes.tableHeaderFooter}>৳{englishToBengali(total)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default ViewOrderTable