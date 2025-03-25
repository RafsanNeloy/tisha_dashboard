import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Container
} from '@mui/material';
import moment from 'moment';
import { formatLargeNumber } from '../../utils/bengaliNumerals';

const MonthlyHistory = () => {
    const bills = useSelector(state => state.bills) || [];
    const customers = useSelector(state => state.customers) || [];

    const monthlyData = useMemo(() => {
        const data = new Map();

        // Process bills
        bills.forEach(bill => {
            const monthKey = moment(bill.date).format('MMMM YYYY');
            if (!data.has(monthKey)) {
                data.set(monthKey, { bills: 0, collections: 0 });
            }
            const monthData = data.get(monthKey);
            monthData.bills += bill.total || 0;
        });

        // Process collections
        customers.forEach(customer => {
            if (customer.paymentInfo && Array.isArray(customer.paymentInfo)) {
                customer.paymentInfo.forEach(payment => {
                    if (payment.type === 'collection') {
                        const monthKey = moment(payment.date).format('MMMM YYYY');
                        if (!data.has(monthKey)) {
                            data.set(monthKey, { bills: 0, collections: 0 });
                        }
                        const monthData = data.get(monthKey);
                        monthData.collections += payment.amount || 0;
                    }
                });
            }
        });

        // Convert to array and sort by date (newest first)
        return Array.from(data.entries())
            .map(([month, data]) => ({
                month,
                ...data
            }))
            .sort((a, b) => moment(b.month, 'MMMM YYYY').diff(moment(a.month, 'MMMM YYYY')));
    }, [bills, customers]);

    return (
        <Container maxWidth="md" sx={{ mt: 4, ml: '260px' }}>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Monthly History
                </Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Bills</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Collections</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monthlyData.map((data) => (
                                <TableRow key={data.month} hover>
                                    <TableCell>{data.month}</TableCell>
                                    <TableCell align="right">৳{formatLargeNumber(data.bills)}</TableCell>
                                    <TableCell align="right">৳{formatLargeNumber(data.collections)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default MonthlyHistory; 