import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useDispatch } from 'react-redux'
import { asyncAddProducts, asyncUpdateProducts } from '../../action/productAction'
import { makeStyles } from '@mui/styles'
import { englishToBengali, bengaliToEnglish } from '../../utils/bengaliNumerals'

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
    const { name: prodName, price: prodPrice, _id, resetUpdateProd } = props
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
            // Convert any English numbers to Bengali
            const bengaliValue = value.split('').map(char => {
                if (/[0-9]/.test(char)) {
                    return englishToBengali(char);
                }
                return char;
            }).join('');
            
            // Only allow Bengali numbers
            if (!/^[০-৯]*$/.test(bengaliValue)) {
                return;
            }
            setPrice(bengaliValue);
        }
    }

    const validate = () => {
        if(name.length === 0) {
            errors.name = "product name can't be blank"
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
                price: parseInt(bengaliToEnglish(price))
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
                    onClick={() => resetUpdateProd()}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    )
}

export default ProductForm