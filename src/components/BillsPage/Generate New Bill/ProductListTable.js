import React from 'react'
import { Table, TableContainer, TableRow, TableHead, TableCell, TableBody, IconButton, Paper, Container, TableFooter, TextField, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { englishToBengali, bengaliToEnglish, formatLargeNumber, isValidMixedNumber, convertMixedInputToNumber, formatNumber } from '../../../utils/bengaliNumerals'

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
        // Convert to numbers and handle decimals properly
        const qty = convertMixedInputToNumber(quantity);
        const prc = convertMixedInputToNumber(price);
        return qty * prc;
    };

    const calculateTotal = (data) => {
        let total = 0;
        data.forEach(ele => {
            const subTotal = convertMixedInputToNumber(ele.subTotal);
            total += subTotal;
        });
        return formatNumber(total, 2); // Format with 2 decimal places
    };

    const handleQuantityInputChange = (product, e) => {
        const value = e.target.value;
        
        // Allow empty input for deletion
        if (value === '') {
            const updatedProduct = {
                ...product,
                quantity: 1,
                subTotal: product.price
            };
            handleChangeQuantity(updatedProduct, 'set');
            return;
        }

        // Validate mixed number input
        if (!isValidMixedNumber(value)) {
            return;
        }

        // Convert input to number
        const quantity = convertMixedInputToNumber(value);
        if (quantity <= 0) return;

        const price = convertMixedInputToNumber(product.price);
        const subTotal = quantity * price;

        const updatedProduct = {
            ...product,
            quantity: quantity,
            subTotal: subTotal
        };
        handleChangeQuantity(updatedProduct, 'set');
    };

    const handleIncrement = (product) => {
        const currentQty = convertMixedInputToNumber(product.quantity);
        const price = convertMixedInputToNumber(product.price);
        const quantity = currentQty + 1;
        const subTotal = calculateSubTotal(quantity, price);

        handleChangeQuantity({
            ...product,
            quantity: quantity,
            subTotal: subTotal
        }, 'set');
    };

    const handleDecrement = (product) => {
        const currentQty = convertMixedInputToNumber(product.quantity);
        if (currentQty <= 1) return;

        const price = convertMixedInputToNumber(product.price);
        const quantity = currentQty - 1;
        const subTotal = calculateSubTotal(quantity, price);

        handleChangeQuantity({
            ...product,
            quantity: quantity,
            subTotal: subTotal
        }, 'set');
    };

    const getProductType = (type) => {
        return type === 0 ? 'ডজন' : 'পিস';
    }

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
                                <TableCell className={classes.tableHeaderFooter}>ধরন</TableCell>
                                <TableCell className={classes.tableHeaderFooter}>মোট</TableCell>
                                <TableCell className={classes.tableHeaderFooter}>বাতিল</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((product, index) => (
                                <TableRow key={product._id}>
                                    <TableCell>{englishToBengali(index + 1)}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>৳{formatNumber(product.price, 2)}</TableCell>
                                    <TableCell className={classes.quantityCell}>
                                        <Box display='flex' alignItems='center'>
                                            <IconButton 
                                                size='small'
                                                onClick={() => handleDecrement(product)}
                                                disabled={convertMixedInputToNumber(product.quantity) <= 1}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <TextField
                                                className={classes.quantityInput}
                                                size="small"
                                                type="text"
                                                value={formatNumber(product.quantity, 3)}
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
                                    <TableCell>{getProductType(product.product_type)}</TableCell>
                                    <TableCell>৳{formatNumber(product.subTotal, 2)}</TableCell>
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