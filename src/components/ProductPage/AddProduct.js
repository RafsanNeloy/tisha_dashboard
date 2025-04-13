import React, { useState } from 'react'
import { TextField, Button, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { asyncAddProducts } from '../../action/productAction'

const useStyle = makeStyles({
    container: {
        width: '40%',
        margin: '2vh 0'
    },
    field: {
        marginBottom: '2vh'
    }
})

const AddProduct = (props) => {
    const classes = useStyle()
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [productType, setProductType] = useState('0') // Default to 'mama' (0)
    const [formErrors, setFormErrors] = useState({})
    const dispatch = useDispatch()
    const products = useSelector(state => state.products) // Get existing products
    const errors = {}

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

    const validate = () => {
        if (name.length === 0) {
            errors.name = "name can't be blank"
        } else {
            // Check for duplicate product name (case-insensitive and normalized)
            const normalizeName = (str) => {
                // Remove all types of whitespace and normalize
                return str.replace(/\s+/g, '').toLowerCase()
            }
            
            const trimmedName = normalizeName(name)
            const isDuplicate = products.some(product => 
                normalizeName(product.name) === trimmedName
            )
            if (isDuplicate) {
                errors.name = "A product with this name already exists"
            }
        }
        if (price.length === 0) {
            errors.price = "price can't be blank"
        }
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const resetForm = () => {
        setName('')
        setPrice('')
        setProductType('0')
        setFormErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            const formData = {
                name: name[0].toUpperCase() + name.slice(1).trim(),
                price: Number(price),
                product_type: Number(productType)
            }
            dispatch(asyncAddProducts(formData, resetForm))
        }
    }

    return (
        <Box className={classes.container}>
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
                >
                    Add Product
                </Button>
            </form>
        </Box>
    )
}

export default AddProduct