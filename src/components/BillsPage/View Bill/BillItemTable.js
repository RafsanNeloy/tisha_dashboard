import React from 'react'
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const useStyle = makeStyles({
    tableHeaderFooter: {
        color: 'black',
        fontWeight: 600,
        fontSize: 14
    }
})

const BillItemTable = (props) => {
    const classes = useStyle()
    
    // Ensure we can handle either bill object or items + total separately
    const { items = [], total = 0, bill = null } = props
    
    // Get additionalPrice from either the bill object or props
    const additionalPrice = (bill?.additionalPrice || props.additionalPrice || 0)
    
    // Get discount percentage and amount from the bill object
    const discountPercentage = bill?.discountPercentage || 0;
    
    const getProductType = (type) => {
        return type === 0 ? 'ডজন' : 'পিস';
    }

    // Calculate subtotal from items
    const subtotal = items.reduce((sum, item) => sum + item.subTotal, 0);
    
    // Use the discountAmount from the bill if available, otherwise calculate it
    const discountAmount = bill?.discountAmount || 
        (subtotal > (total - additionalPrice) ? subtotal - (total - additionalPrice) : 0);

    return (
        <TableContainer component={Paper}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaderFooter}>S.No</TableCell>
                        <TableCell className={classes.tableHeaderFooter}><b>মালের নাম</b></TableCell>
                        <TableCell className={classes.tableHeaderFooter}><b>দাম</b></TableCell>
                        <TableCell className={classes.tableHeaderFooter}><b>পরিমান</b></TableCell>
                        <TableCell className={classes.tableHeaderFooter}><b>ধরন</b></TableCell>
                        <TableCell className={classes.tableHeaderFooter}><b>মোট</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{englishToBengali(index + 1)}</TableCell>
                            <TableCell>{item.name || 'Unknown'}</TableCell>
                            <TableCell>৳{englishToBengali(item.price)}</TableCell>
                            <TableCell>{englishToBengali(item.quantity)}</TableCell>
                            <TableCell>{getProductType(item.product_type)}</TableCell>
                            <TableCell>৳{englishToBengali(item.subTotal)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} align="right" className={classes.tableHeaderFooter}>
                            সাবটোটাল:
                        </TableCell>
                        <TableCell colSpan={2} className={classes.tableHeaderFooter}>
                            ৳{englishToBengali(subtotal)}
                        </TableCell>
                    </TableRow>
                    
                    {discountAmount > 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="right" className={classes.tableHeaderFooter} style={{ color: 'green' }}>
                                (-) কমিশন ({englishToBengali(discountPercentage)}%):
                            </TableCell>
                            <TableCell colSpan={2} className={classes.tableHeaderFooter} style={{ color: 'green' }}>
                                ৳{englishToBengali(discountAmount)}
                            </TableCell>
                        </TableRow>
                    )}
                    
                    {additionalPrice > 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="right" className={classes.tableHeaderFooter}>
                                (+) ট্রাঃ খরচ:
                            </TableCell>
                            <TableCell colSpan={2} className={classes.tableHeaderFooter}>
                                ৳{englishToBengali(additionalPrice)}
                            </TableCell>
                        </TableRow>
                    )}
                    
                    <TableRow>
                        <TableCell colSpan={4} align="right" className={classes.tableHeaderFooter}>
                            মোট টাকা:
                        </TableCell>
                        <TableCell colSpan={2} className={classes.tableHeaderFooter}>
                            ৳{englishToBengali(total)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default BillItemTable