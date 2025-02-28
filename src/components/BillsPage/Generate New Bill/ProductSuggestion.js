import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { TextField, Box } from '@mui/material'
import { Autocomplete } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const useStyle = makeStyles({
    suggestionBox: {
        position: 'relative'
    }
})

const ProductSuggestion = (props) => {
    const { handleAddLineItem } = props
    const [ value, setValue ] = useState({})
    const [ inputValue, setInputValue ] = useState('')
    const products = useSelector(state => state.products)
    const classes = useStyle()

    const handleValueChange = (e, newValue) => {
        setValue(newValue)
        const productData = {
            ...newValue, 
            quantity: 1,
            product_type: newValue.product_type
        }
        productData.subTotal = productData.quantity * productData.price
        if(newValue) {
            handleAddLineItem(productData)
            resetSuggestion()
        }
    }

    const handleInputChange = (e, newInputValue) => {
        setInputValue(newInputValue)
    }

    const resetSuggestion = () => {
        setValue(null)
        setInputValue('')
    }

    const formatPrice = (price) => {
        return `৳${englishToBengali(price)}`;
    }

    return (
        <Box className={classes.suggestionBox}>
            <Autocomplete 
                value={value}
                onChange={handleValueChange}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                options={products}
                getOptionLabel={option => Object.keys(option).length>0 ? `${option.name} - ${formatPrice(option.price)}` : ''}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        margin='dense' 
                        label='পণ্যের নাম খুঁজুন' 
                        variant='outlined' 
                    />
                )}
                noOptionsText="কোন পণ্য পাওয়া যায়নি"
                clearOnBlur
                clearOnEscape
            />
        </Box>
    )
}

export default ProductSuggestion