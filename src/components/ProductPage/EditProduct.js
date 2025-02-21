import React, { useState } from 'react'
import { Container, Typography, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useDispatch } from 'react-redux'
import { asyncUpdateProducts } from '../../action/productAction'

const useStyle = makeStyles({
    title: {
        fontWeight: 700
    },
    container: {
        padding: '10px 0'
    },
    field: {
        marginBottom: '2vh'
    },
    form: {
        width: '40%'
    }
})

const EditProduct = (props) => {
    const { updateProd, resetUpdateProd } = props
    const [name, setName] = useState(updateProd.name)
    const [price, setPrice] = useState(updateProd.price)
    const [productType, setProductType] = useState(updateProd.product_type.toString())
    const [formErrors, setFormErrors] = useState({})
    const dispatch = useDispatch()
    const classes = useStyle()
    const errors = {}

    const validate = () => {
        if (name.length === 0) {
            errors.name = "name can't be blank"
        }
        if (price.length === 0) {
            errors.price = "price can't be blank"
        }
        setFormErrors(errors)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'name') {
            setName(value)
        } else if (name === 'price') {
            if (Number(value) || value === '') {
                setPrice(value)
            }
        } else if (name === 'productType') {
            setProductType(value)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        validate()
        if (Object.keys(errors).length === 0) {
            const formData = {
                name: name[0].toUpperCase() + name.slice(1),
                price: Number(price),
                product_type: Number(productType)
            }
            dispatch(asyncUpdateProducts(updateProd._id, formData, resetUpdateProd))
        }
    }

    return (
        <Container className={classes.container}>
            <Typography className={classes.title} variant='h5'>Edit Product</Typography>
            <Box className={classes.form}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        className={classes.field}
                        variant='outlined'
                        label='enter product name'
                        fullWidth
                        value={name}
                        onChange={handleChange}
                        name='name'
                        error={Boolean(formErrors.name)}
                        helperText={formErrors.name}
                    />
                    <TextField
                        className={classes.field}
                        variant='outlined'
                        label='enter price'
                        fullWidth
                        value={price}
                        onChange={handleChange}
                        name='price'
                        error={Boolean(formErrors.price)}
                        helperText={formErrors.price}
                    />
                    <FormControl component="fieldset" className={classes.field}>
                        <FormLabel component="legend">Product Type</FormLabel>
                        <RadioGroup
                            row
                            name="productType"
                            value={productType}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="0" control={<Radio />} label="ডজন" />
                            <FormControlLabel value="1" control={<Radio />} label="পিস" />
                        </RadioGroup>
                    </FormControl>
                    <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                        fullWidth
                    >
                        Update Product
                    </Button>
                </form>
            </Box>
        </Container>
    )
}

export default EditProduct