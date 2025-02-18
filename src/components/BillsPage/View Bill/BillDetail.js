import React, { useState } from 'react'
import { Typography, TextField, Box } from '@mui/material'
import moment from 'moment'
import { englishToBengali } from '../../../utils/bengaliNumerals'

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
            <Typography variant='h6'><strong>অর্ডার আইডি:</strong> {id}</Typography>
            <Typography variant='h6'><strong>গ্রাহকের নাম:</strong> {customer?.name || 'Loading...'}</Typography>
            <Box sx={{ my: 2 }}>
                <TextField
                    fullWidth
                    label="গ্রাহকের ঠিকানা"
                    multiline
                    rows={2}
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="গ্রাহকের ঠিকানা লিখুন"
                    variant="outlined"
                />
            </Box>
            <Typography variant='h6'>
                <strong>অর্ডারের তারিখ ও সময়:</strong> {moment(bill?.createdAt).format('DD/MM/YYYY, hh:mm A')}
            </Typography>
            <Typography variant='h6'>
                <strong>মোট টাকা:</strong> ৳{englishToBengali(bill?.total || 0)}
            </Typography>
        </Box>
    )
}

export default BillDetail