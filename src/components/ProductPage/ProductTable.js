import React from 'react'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSelector } from 'react-redux'
import { englishToBengali } from '../../utils/bengaliNumerals'

const useStyle = makeStyles({
    table: {
        maxHeight: '380px'
    },
    nameHeader: {
        width: '35%'
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
    }
})

const ProductTable = (props) => {
    const { handleDeleteProduct, handleViewProduct, handleUpdateProd, products, resetSearch } = props
    const classes = useStyle()
    const auth = useSelector(state => state.auth)
    const isAdmin = auth?.user?.role === 'admin'

    const getProductType = (type) => {
        return type === 0 ? 'মামা' : 'মোটু'
    }

    return (
        <TableContainer className={classes.table} component={Paper}>
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader} align='center'>ক্রমিক</TableCell>
                        <TableCell className={`${classes.nameHeader} ${classes.tableHeader}`} align='center'>নাম</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>দাম</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>ধরন</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>View</TableCell>
                        <TableCell className={classes.tableHeader} align='center'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((prod, index) => (
                        <TableRow hover key={prod._id}>
                            <TableCell>{englishToBengali(index + 1)}</TableCell>
                            <TableCell>{prod.name}</TableCell>
                            <TableCell>৳{englishToBengali(prod.price)}</TableCell>
                            <TableCell>{getProductType(prod.product_type)}</TableCell>
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
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ProductTable