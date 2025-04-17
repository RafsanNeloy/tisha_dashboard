import React, { useState, useEffect, useCallback, memo } from 'react'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box, TextField, Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector, useDispatch } from 'react-redux'
import { englishToBengali } from '../../utils/bengaliNumerals'
import axios from 'axios'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { updatePreviousStock, updateStockInStore } from '../../action/stockAction'
import { getSocket } from '../../utils/socket'
import CircularProgress from '@mui/material/CircularProgress'

const useStyle = makeStyles({
    table: { maxHeight: '380px' },
    nameHeader: { width: '35%' },
    tableBtns: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    tableHeader: {
        backgroundColor: 'black',
        color: 'white'
    },
    headerName: { color: 'white' },
    '@keyframes fadeInOut': {
        '0%': { opacity: 0 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0 }
    }
});

const getProductType = (type) => type === 0 ? 'ডজন' : 'পিস';

const StockDisplay = memo(({ currentStock, updating, socketError }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {englishToBengali(currentStock)}
        {updating && (
            <CircularProgress 
                size={20} 
                style={{ 
                    color: 'green',
                    animation: 'fadeInOut 1s ease-in-out'
                }} 
            />
        )}
        {socketError && <CircularProgress size={16} style={{ color: 'orange' }} />}
    </div>
));

const ProductRow = memo(({ prod, index, handleDeleteProduct, handleViewProduct, handleUpdateProd, resetSearch }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [socketError, setSocketError] = useState(false);
    const classes = useStyle();
    const { role } = useSelector(state => state.auth.user) || {};
    const isAdmin = role === 'admin';
    const stockData = useSelector(state => state.stock[prod._id]) || {
        previousStock: 0,
        addedStock: [],
        billedStock: 0
    };

    useEffect(() => {
        const socket = getSocket();

        const handleStockUpdate = (data) => {
            if (data.productId === prod._id) {
                setUpdating(true);
                dispatch(updateStockInStore(data.productId, data.stock));
                setTimeout(() => setUpdating(false), 1000);
            }
        };

        socket.on('stockUpdate', handleStockUpdate);
        socket.on('connect', () => setSocketError(false));
        socket.on('connect_error', () => setSocketError(true));

        return () => {
            socket.off('stockUpdate', handleStockUpdate);
            socket.off('connect');
            socket.off('connect_error');
        };
    }, [prod._id, dispatch]);

    const handlePreviousStockUpdate = useCallback(async (newValue) => {
        try {
            dispatch(updateStockInStore(prod._id, {
                ...stockData,
                previousStock: Number(newValue)
            }));
            await dispatch(updatePreviousStock(prod._id, newValue));
        } catch (error) {
            dispatch(updateStockInStore(prod._id, stockData));
        }
    }, [dispatch, prod._id, stockData]);

    const calculateCurrentStock = useCallback(() => {
        const totalAdded = stockData.addedStock?.reduce((sum, item) => sum + item.amount, 0) || 0;
        return (stockData.previousStock || 0) + totalAdded - (stockData.billedStock || 0);
    }, [stockData]);

    return (
        <>
            <TableRow hover>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    {englishToBengali(index + 1)}
                </TableCell>
                <TableCell>{prod.name}</TableCell>
                <TableCell>৳{englishToBengali(prod.price)}</TableCell>
                <TableCell>{getProductType(prod.product_type)}</TableCell>
                <TableCell align='center'>
                    <StockDisplay 
                        currentStock={calculateCurrentStock()}
                        updating={updating}
                        socketError={socketError}
                    />
                </TableCell>
                <TableCell align='center'>
                    <Button 
                        variant='contained'
                        color='primary'
                        onClick={() => handleViewProduct(prod._id)}
                    >
                        View
                    </Button>
                </TableCell>
                <TableCell className={classes.tableBtns}>
                    <Button 
                        variant='contained'
                        color='primary'
                        onClick={() => {
                            handleUpdateProd(prod)
                            resetSearch()
                        }}
                    >
                        Update
                    </Button>
                    {isAdmin && (
                        <Button 
                            variant='contained'
                            color='secondary'
                            onClick={() => {
                                handleDeleteProduct(prod._id)
                                resetSearch()
                            }}
                        >
                            remove
                        </Button>
                    )}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                স্টক বিবরণ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        label="পূর্ববর্তী স্টক"
                                        type="number"
                                        value={stockData.previousStock || 0}
                                        onChange={(e) => handlePreviousStockUpdate(e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        মোট যোগ: {englishToBengali(stockData.addedStock?.reduce((sum, item) => sum + item.amount, 0) || 0)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        মোট বিক্রয়: {englishToBengali(stockData.billedStock || 0)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
});

const ProductTable = memo(({ handleDeleteProduct, handleViewProduct, handleUpdateProd, products, resetSearch }) => {
    const classes = useStyle();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchInitialStockData = async () => {
            const token = localStorage.getItem('token');
            try {
                const promises = products.map(product => 
                    axios.get(`http://localhost:5001/api/stock/${product._id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }).catch(() => ({
                        data: {
                            product: product._id,
                            previousStock: 0,
                            addedStock: [],
                            billedStock: 0
                        }
                    }))
                );

                const responses = await Promise.all(promises);
                responses.forEach((response, index) => {
                    if (response?.data) {
                        dispatch(updateStockInStore(products[index]._id, response.data));
                    }
                });
            } catch (error) {}
        };

        fetchInitialStockData();
    }, [products, dispatch]);

    return (
        <TableContainer className={classes.table} component={Paper}>
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader} align='center'>ক্রমিক</TableCell>
                        <TableCell className={`${classes.nameHeader} ${classes.tableHeader}`} align='center'>নাম</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>দাম</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>ধরন</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>বর্তমান স্টক</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>View</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((prod, index) => (
                        <ProductRow
                            key={prod._id}
                            prod={prod}
                            index={index}
                            handleDeleteProduct={handleDeleteProduct}
                            handleViewProduct={handleViewProduct}
                            handleUpdateProd={handleUpdateProd}
                            resetSearch={resetSearch}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default ProductTable;