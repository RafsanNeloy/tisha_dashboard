import React, { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { asyncAddCustomer, asyncUpdateCustomer } from '../../action/customerAction'
import validator from 'validator'

const useStyle = makeStyles({
    // form:{
    //     display:'flex',
    //     flexDirection: 'row',
    //     flexWrap: 'wrap'
    // },
    formField:{
        width: '24vw',
        marginRight: '1vw'
    },
    button: {
        display: 'flex',
        width: '13vw',
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    addBtn: {
        width: '6vw',
        height: '40px',
        marginTop: '7px'
    },
    cancelBtn: {
        width: '6vw',
        height: '40px',
        marginTop: '7px'
    }
})

const CustomerForm = (props) => {
    const { name: custName, mobile: custMobile, address: custAddress, _id, resetUpdateCust, handleClose } = props
    const [ name, setName ] = useState(custName ? custName : '')
    const [ mobile, setMobile ] = useState(custMobile ? custMobile : '')
    const [ address, setAddress ] = useState(custAddress ? custAddress : '')
    const [ formErrors, setFormErrors ] = useState({})
    const errors = {}
    const dispatch = useDispatch()
    const classes = useStyle()
    const customers = useSelector(state => state.customers)

    const handleChange = (e) => {
        if(e.target.name==='name') {
            setName(e.target.value)
        } else if(e.target.name==='mobile') {
            if(Number(e.target.value) || e.target.value==='') {
                if(e.target.value.length <= 10) {
                    setMobile(e.target.value)
                }
            }
        } else if(e.target.name==='address') {
            setAddress(e.target.value)
        }
    }

    const validate = () => {
        if(name.length===0){
            errors.name = "name can't be blank"
        }
        if(mobile.length !== 10){
            errors.mobile = "enter valid mobile number"
        }
        if(address.length === 0){
            errors.address = 'address cannot be empty'
        }
        setFormErrors(errors)
    }

    const checkForDuplicate = () => {
        const normalizedName = name.trim().toLowerCase()
        const normalizedAddress = address.trim().toLowerCase()
        
        const duplicate = customers.find(customer => 
            customer.name.trim().toLowerCase() === normalizedName && 
            customer.address.trim().toLowerCase() === normalizedAddress
        )
        
        if (duplicate) {
            errors.duplicate = "A customer with this name and address already exists"
            setFormErrors(errors)
            return true
        }
        return false
    }

    const resetForm = () => {
        setName('')
        setAddress('')
        setMobile('')
        if(handleClose){
            handleClose()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        validate()
        if(Object.keys(errors).length === 0){
            if (!checkForDuplicate()) {
                const formData = {
                    name: name[0].toUpperCase() + name.slice(1),
                    mobile: mobile,
                    address: address
                }
                if(_id) {
                    dispatch(asyncUpdateCustomer(_id, formData, resetUpdateCust))
                } else {
                    dispatch(asyncAddCustomer(formData, resetForm, handleClose))
                }
            }
        }
    }

    return (
            <form className={classes.form} autoComplete='off' onSubmit={handleSubmit}>
                <Box display='flex' flexDirection={handleClose ? 'column' : 'row'} flexWrap='wrap'>
                    <TextField 
                        className={classes.formField}
                        name='name'
                        label='Name'
                        value={name}
                        onChange={handleChange}
                        error={formErrors.name ? true : false}
                        helperText={formErrors.name ? formErrors.name : null}
                        variant='outlined'
                        margin='dense'
                    />
                    <TextField 
                        className={classes.formField}
                        name='mobile'
                        label='Mobile'
                        value={mobile}
                        onChange={handleChange}
                        error={formErrors.mobile ? true : false}
                        helperText={formErrors.mobile ? formErrors.mobile : null}
                        variant='outlined'
                        margin='dense'
                    />
                    <TextField 
                        className={classes.formField}
                        name='address'
                        label='Address'
                        value={address}
                        onChange={handleChange}
                        error={formErrors.address ? true : false}
                        helperText={formErrors.address ? formErrors.address : null}
                        variant='outlined'
                        margin='dense'
                        multiline
                        rows={3}
                    />
                    {formErrors.duplicate && (
                        <Box width="100%" color="error.main" mt={1}>
                            {formErrors.duplicate}
                        </Box>
                    )}
                    {
                        _id ? (
                            <div className={classes.button}>
                                <Button 
                                    className={classes.addBtn}
                                    type='submit'
                                    variant='contained' 
                                    color='primary' 
                                >
                                    update
                                </Button>
                                <Button
                                    className={classes.cancelBtn}
                                    variant='contained'
                                    color='secondary'
                                    onClick={resetUpdateCust}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                                <div className={classes.button}>
                                    <Button 
                                        className={classes.addBtn}
                                        type='submit' 
                                        variant='contained' 
                                        color='primary'
                                    >
                                        add
                                    </Button>
                                    {
                                        (name.length>0 || address.length>0 || mobile.length>0) && (
                                            <Button 
                                                className={classes.cancelBtn}
                                                onClick = {resetForm} 
                                                variant='contained' 
                                                color='secondary'
                                            >
                                                Cancel
                                            </Button>
                                        ) 
                                    }
                                </div>
                                
                        )  
                    }
                </Box>
                
            </form>
    )
}

export default CustomerForm