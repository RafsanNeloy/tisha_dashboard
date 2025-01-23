import React from 'react'
import { Table, TableContainer, TableRow, TableHead, TableCell, TableBody, IconButton, Paper, Container, TableFooter, TextField, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { englishToBengali, bengaliToEnglish, formatLargeNumber } from '../../../utils/bengaliNumerals'

const useStyle = makeStyles({
    tableHeaderFooter: {
        color: 'black',
        fontWeight: 600,
        fontSize: 14
    },
    quantityInput: {
        width: '100px',
        margin: '0 8px',
        '& input': {
            padding: '5px 8px',
            fontSize: '14px'
        }
    },
    quantityCell: {
        minWidth: '200px'
    }
})

const ProductListTable = (props) => {
    const { items, handleChangeQuantity, handleRemoveLineItem } = props
    const classes = useStyle()

    const calculateSubTotal = (quantity, price) => {
        // Convert to numbers and handle large values
        const qty = parseInt(quantity.toString().replace(/,/g, ''));
        const prc = parseInt(price.toString().replace(/,/g, ''));
        return qty * prc;
    };

    const calculateTotal = (data) => {
        let total = 0;
        data.forEach(ele => {
            // Handle large numbers by removing commas and converting to number
            const subTotal = parseInt(ele.subTotal.toString().replace(/,/g, ''));
            total += subTotal;
        });
        return formatLargeNumber(total);
    };

    const handleQuantityInputChange = (product, e) => {
        const value = e.target.value;
        
        // Convert any English numbers to Bengali
        const bengaliValue = value.split('').map(char => {
            if (/[0-9]/.test(char)) {
                return englishToBengali(char);
            }
            return char;
        }).join('');

        // Allow empty string for deletion
        if (bengaliValue === '') {
            const updatedProduct = {
                ...product,
                quantity: 1,  // Default to 1 if empty
                subTotal: product.price
            };
            handleChangeQuantity(updatedProduct, 'set');
            return;
        }

        // Only allow Bengali numbers
        if (!/^[০-৯]*$/.test(bengaliValue)) {
            return;
        }

        const quantity = parseInt(bengaliToEnglish(bengaliValue)) || 1;
        const price = parseInt(bengaliToEnglish(product.price));
        const subTotal = calculateSubTotal(quantity, price);

        const updatedProduct = {
            ...product,
            quantity: quantity,
            subTotal: subTotal
        };
        handleChangeQuantity(updatedProduct, 'set');
    };

    const handleIncrement = (product) => {
        const currentQty = parseInt(bengaliToEnglish(product.quantity));
        const price = parseInt(bengaliToEnglish(product.price));
        const quantity = currentQty + 1;
        const subTotal = calculateSubTotal(quantity, price);

        handleChangeQuantity({
            ...product,
            quantity: quantity,
            subTotal: subTotal
        }, 'set');
    };

    const handleDecrement = (product) => {
        const currentQty = parseInt(bengaliToEnglish(product.quantity));
        if (currentQty <= 1) return;

        const price = parseInt(bengaliToEnglish(product.price));
        const quantity = currentQty - 1;
        const subTotal = calculateSubTotal(quantity, price);

        handleChangeQuantity({
            ...product,
            quantity: quantity,
            subTotal: subTotal
        }, 'set');
    };

    return (
        <Container disableGutters>
            {items.length > 0 && (
                <TableContainer component={Paper}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableHeaderFooter}>ক্রমিক</TableCell>
                                <TableCell className={classes.tableHeaderFooter}>মালের নাম</TableCell>
                                <TableCell className={classes.tableHeaderFooter}>দাম</TableCell>
                                <TableCell className={`${classes.tableHeaderFooter} ${classes.quantityCell}`}>পরিমান</TableCell>
                                <TableCell className={classes.tableHeaderFooter}>মোট</TableCell>
                                <TableCell className={classes.tableHeaderFooter}>বাতিল</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((product, index) => (
                                <TableRow key={product._id}>
                                    <TableCell>{englishToBengali(index + 1)}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>৳{formatLargeNumber(product.price)}</TableCell>
                                    <TableCell className={classes.quantityCell}>
                                        <Box display='flex' alignItems='center'>
                                            <IconButton 
                                                size='small'
                                                onClick={() => handleDecrement(product)}
                                                disabled={parseInt(bengaliToEnglish(product.quantity)) <= 1}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <TextField
                                                className={classes.quantityInput}
                                                size="small"
                                                type="text"
                                                value={product.quantity ? englishToBengali(product.quantity) : ''}
                                                onChange={(e) => handleQuantityInputChange(product, e)}
                                                inputProps={{ 
                                                    style: { 
                                                        textAlign: 'center',
                                                        width: '100%'
                                                    }
                                                }}
                                            />
                                            <IconButton 
                                                size='small'
                                                onClick={() => handleIncrement(product)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell>৳{formatLargeNumber(product.subTotal)}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            size='small'
                                            onClick={() => handleRemoveLineItem(product)}
                                        >
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell className={classes.tableHeaderFooter}>মোট টাকা</TableCell>
                                <TableCell className={classes.tableHeaderFooter}>৳{calculateTotal(items)}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default ProductListTable;