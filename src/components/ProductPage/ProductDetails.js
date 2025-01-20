import { Typography, Paper, Button, makeStyles, Box, Divider } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { asyncDeleteProducts, asyncProductDetail } from '../../action/productAction'
import moment from 'moment'

const useStyle= makeStyles({
    container:{
        display: 'grid',
        placeItems: 'center',
        width: '350px',
        height: "230px",
        padding: '10px'
    },
    content:{
        marginTop: '30px'
    },
    noProduct: {
        width: '150px',
        wordBreak: 'break-word',
        color: 'grey'
    },
    detailsTitle:{
        textAlign: 'center',
        fontWeight: 600
    }
})

const ProductDetails = (props) => {
    const { productId, resetViewProduct, handleUpdateProd } = props
    const classes = useStyle()
    const [ detail, setDetail ] = useState({})
    const dispatch = useDispatch()

    const handleDetailChange = (data) => {
        setDetail(data)
    }

    const handleUpdate = (data) => {
        handleUpdateProd(data)
        resetViewProduct()
    }

    const handleRemove = (id) => {
        dispatch(asyncDeleteProducts(id))
        resetViewProduct()
    }

    const handleClose = () => {
        setDetail({})
        resetViewProduct()
    }

    useEffect(() => {
        if(productId) {
            dispatch(asyncProductDetail(productId, handleDetailChange))
        }
    }, [productId, dispatch])

    return (
        <Paper className={classes.container}>
            {
                productId ? (
                    <Box>
                        <Typography className={classes.detailsTitle} variant='h5'>Product Details</Typography>
                        <Divider variant='middle' />
                        <Box className={classes.content}>
                            <Typography variant='h6'>Name: {detail.name}</Typography>
                            <Typography variant='h6'>Price: {detail.price}</Typography>
                            <Typography variant='h6'>Added on: {detail.createdAt && moment(detail.createdAt).format('hh:mm A, DD/MM/YYYY')}</Typography>
                            <Box display='flex' flexDirection='row' justifyContent='space-evenly'>
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    onClick={() => handleUpdate(detail)}
                                >
                                    update
                                </Button>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    onClick={() => handleRemove(detail._id)}
                                >
                                    remove
                                </Button>
                                <Button
                                    variant='outlined'
                                    onClick={handleClose}
                                >
                                    close
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Typography className={classes.noProduct} variant='h6'>select a product to view its details</Typography>
                )
            }
        </Paper>
    )
}

export default ProductDetails