import React, { useState } from 'react'
import { Typography, TextField, Box } from '@mui/material'
import moment from 'moment'

const BillDetail = (props) => {
    const { id, customer, bill, onAddressChange } = props
    const [address, setAddress] = useState(customer?.address || '')

    const handleAddressChange = (e) => {
        setAddress(e.target.value)
        if (onAddressChange) {
            onAddressChange(e.target.value)
        }
    }

    return (
        <Box sx={{ my: 2 }}>
            <Typography variant='h6'><strong>Order ID:</strong> {id}</Typography>
            <Typography variant='h6'><strong>Customer Name:</strong> {customer?.name || 'Loading...'}</Typography>
            <Box sx={{ my: 2 }}>
                <TextField
                    fullWidth
                    label="Customer Address"
                    multiline
                    rows={2}
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="Enter customer address"
                    variant="outlined"
                />
            </Box>
            <Typography variant='h6'><strong>{`Order date & time`}:</strong> {moment(bill?.createdAt).format('DD/MM/YYYY, hh:mm A')}</Typography>
            <Typography variant='h6'><strong>Total Amount of purchase:</strong> {bill?.total || 0}</Typography>
        </Box>
    )
}

export default BillDetail