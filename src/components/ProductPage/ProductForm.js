import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useDispatch } from 'react-redux'
import { asyncAddProducts, asyncUpdateProducts } from '../../action/productAction'
import { makeStyles } from '@mui/styles'
import { englishToBengali, bengaliToEnglish, isValidMixedNumber, convertMixedInputToNumber } from '../../utils/bengaliNumerals'

const useStyle = makeStyles({
    form: {
        marginTop: '20px'
    },
    input: {
        width: '100%',
        marginBottom: '15px'
    }
})

const ProductForm = (props) => {
    const { name: prodName, price: prodPrice, _id, resetUpdateProd, existingProducts } = props
    const [ name, setName ] = useState(prodName ? prodName : '')
    const [ price, setPrice ] = useState(englishToBengali(prodPrice ? prodPrice : ''))
    const [ formErrors, setFormErrors ] = useState({})
    const errors = {}
    const dispatch = useDispatch()
    const classes = useStyle()

    const handleChange = (e) => {
        if(e.target.name === 'name') {
            setName(e.target.value)
        } else if(e.target.name === 'price') {
            const value = e.target.value;
            
            // Allow empty input
            if (value === '') {
                setPrice('');
                return;
            }

            // Validate mixed number input
            if (!isValidMixedNumber(value)) {
                return;
            }

            setPrice(value);
        }
    }

    const validate = () => {
        if(name.length === 0) {
            errors.name = "product name can't be blank"
        } else {
            // Check for duplicate product name
            const normalizedName = name.trim().toLowerCase()
            const isDuplicate = existingProducts?.some(product => 
                product.name.toLowerCase() === normalizedName && product._id !== _id
            )
            if (isDuplicate) {
                errors.name = "Product with this name already exists"
            }
        }
        if(price.length === 0) {
            errors.price = "enter valid amount"
        }
        setFormErrors(errors)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        validate()
        if(Object.keys(errors).length === 0) {
            const formData = {
                name: name[0].toUpperCase() + name.slice(1),
                price: convertMixedInputToNumber(price)
            }
            if(_id) {
                dispatch(asyncUpdateProducts(_id, formData, resetUpdateProd))
            } else {
                dispatch(asyncAddProducts(formData, resetForm))
            }
        }
    }

    const resetForm = () => {
        setName('')
        setPrice('')
        setFormErrors({})
    }

    const handleCancel = () => {
        resetForm()
        if (resetUpdateProd) {
            resetUpdateProd()
        }
    }

    return (
        <Box component='form' onSubmit={handleSubmit} className={classes.form}>
            <TextField
                className={classes.input}
                label='পণ্যের নাম'
                name='name'
                value={name}
                onChange={handleChange}
                error={formErrors.name ? true : false}
                helperText={formErrors.name ? formErrors.name : null}
                required
            />
            <TextField
                className={classes.input}
                label='দাম'
                name='price'
                value={price}
                onChange={handleChange}
                error={formErrors.price ? true : false}
                helperText={formErrors.price ? formErrors.price : null}
                required
            />
            <Box>
                <Button
                    variant='contained'
                    type='submit'
                    color='primary'
                    style={{ marginRight: '10px' }}
                >
                    {_id ? 'Update' : 'Add'}
                </Button>
                <Button
                    variant='contained'
                    onClick={handleCancel}
                    type='button'
                >
                    বাতিল
                </Button>
            </Box>
        </Box>
    )
}

export default ProductForm