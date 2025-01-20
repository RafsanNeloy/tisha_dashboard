import React from 'react'
import { Typography } from '@mui/material'
import moment from 'moment'

const BillDetail = (props) => {
    const { id, customer, bill } = props
    console.log('BillDetail props:', props); // Debug log

    return (
        <>
            <Typography variant='h6'><strong>Order ID:</strong> {id}</Typography>
            <Typography variant='h6'><strong>Customer Name:</strong> {customer?.name || 'Loading...'}</Typography>
            <Typography variant='h6'><strong>{`Order date & time`}:</strong> {moment(bill?.createdAt).format('DD/MM/YYYY, hh:mm A')}</Typography>
            <Typography variant='h6'><strong>Total Amount of purchase:</strong> {bill?.total || 0}</Typography>
        </>
    )
}

export default BillDetail