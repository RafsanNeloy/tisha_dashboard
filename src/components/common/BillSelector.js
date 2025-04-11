import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { formatLargeNumber } from '../../utils/bengaliNumerals';
import axios from 'axios';

const BillSelector = ({ bills, selectedBill, onBillSelect }) => {
    const [customerBills, setCustomerBills] = useState([]);
    const [alert, setAlert] = useState(null);

    const fetchCustomerBills = async (customerId) => {
        try {
            // Remove token for public access
            const response = await axios.get(
                `http://localhost:5001/api/customers/${customerId}/bills`
            );
            setCustomerBills(response.data.bills);
        } catch (error) {
            console.error('Error fetching bills:', error);
            setAlert({
                open: true,
                message: 'Error fetching customer bills',
                severity: 'error'
            });
        }
    };

    if (!bills || bills.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                এই গ্রাহকের কোন বিল নেই
            </Typography>
        );
    }

    return (
        <FormControl fullWidth>
            <InputLabel>বিল নির্বাচন করুন</InputLabel>
            <Select
                value={selectedBill || ''}
                onChange={(e) => onBillSelect(e.target.value)}
                label="বিল নির্বাচন করুন"
            >
                {bills.map((bill) => (
                    <MenuItem key={bill.billNumber} value={bill.billNumber}>
                        <Box>
                            <Typography variant="body1">
                                বিল নং: {bill.billNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                মোট: ৳{formatLargeNumber(bill.total)} | বাকি: ৳{formatLargeNumber(bill.remainingAmount)}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BillSelector; 