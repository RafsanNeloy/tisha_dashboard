import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

const ViewCustomer = (props) => {
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/customers/${id}/bills`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCustomerData(response.data);
            setLoading(false);
        } catch (error) {
            console.log('Error details:', error.response);
            // If it's a 404, we still want to show the customer info
            if (error.response?.status === 404) {
                try {
                    // Fetch just the customer info
                    const customerResponse = await axios.get(`http://localhost:5001/api/customers/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setCustomerData({
                        customer: customerResponse.data,
                        stats: {
                            totalOrders: 0,
                            totalAmount: 0
                        },
                        bills: []
                    });
                    setLoading(false);
                } catch (customerError) {
                    setError('Customer not found');
                    setLoading(false);
                }
            } else {
                setError('Error loading customer data');
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!customerData) return <div>No customer data found</div>;

    return (
        <div>
            <Typography variant="h6">Customer Details</Typography>
            <Typography>Name: {customerData.customer.name}</Typography>
            <Typography>Mobile: {customerData.customer.mobile}</Typography>
            <Typography>Address: {customerData.customer.address}</Typography>
            <div>
                <h3>Statistics</h3>
                <p>Total Orders: {customerData.stats.totalOrders}</p>
                <p>Total Amount: ৳{customerData.stats.totalAmount}</p>
            </div>
            {customerData.bills.length > 0 ? (
                <div>
                    <h3>Bills</h3>
                    {/* Your existing bills display code */}
                </div>
            ) : (
                <p>No bills found for this customer</p>
            )}
        </div>
    );
};

export default ViewCustomer; 