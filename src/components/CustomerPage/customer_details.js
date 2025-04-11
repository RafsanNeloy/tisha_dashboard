import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DetailsIcon from '@mui/icons-material/RemoveRedEye';
import { formatLargeNumber } from '../../utils/bengaliNumerals';
import AmountHighlight from '../common/AmountHighlight';
import './customer_details.css';
import { useSelector } from 'react-redux';

const PaymentDetailsDialog = ({ open, onClose, paymentInfo = [] }) => {
  const getChipColor = (type) => {
    switch(type) {
      case 'wastage': return 'warning';
      case 'less': return 'secondary';
      case 'collection': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Payment Details</DialogTitle>
      <DialogContent>
        {paymentInfo.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentInfo.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.type} 
                        color={getChipColor(payment.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        color={
                          payment.type === 'collection' ? 'success.main' : 'error.main'
                        }
                      >
                        ৳{formatLargeNumber(payment.amount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" textAlign="center" py={3}>
            No payments found for this type
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { user } = useSelector(state => state.auth);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previousAmount, setPreviousAmount] = useState(0);
  const [editFormData, setEditFormData] = useState({
    name: '',
    mobile: '',
    address: ''
  });
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `http://localhost:5001/api/customers/${customerId}/bills`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Fetched Customer Data:', response.data);
      
      // Get previousAmount directly from the API response
      const previousAmountValue = response.data.customer.previousAmount || 0;
      
      // Update all state at once with the API data
      setCustomerData({
        customer: response.data.customer,
        bills: response.data.bills || [],
        stats: response.data.stats
      });

      // Update the input field with the API value
      setPreviousAmount(previousAmountValue);
      
      setEditFormData({
        name: response.data.customer.name || '',
        mobile: response.data.customer.mobile || '',
        address: response.data.customer.address || ''
      });
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError(error.response?.data?.message || 'Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedData = {
        ...editFormData
      };

      console.log('Updating customer with data:', updatedData);

      const response = await axios.put(
        `http://localhost:5001/api/customers/${customerId}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Update response:', response.data);
      
      await fetchCustomerData();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'previousAmount' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
  };

  const calculatePaymentSummary = () => {
    if (!customerData?.customer?.paymentInfo) return {
      wastage: { total: 0, count: 0 },
      less: { total: 0, count: 0 },
      collection: { total: 0, count: 0 }
    };

    return customerData.customer.paymentInfo.reduce((summary, payment) => {
      // Initialize the payment type if not exists
      if (!summary[payment.type]) {
        summary[payment.type] = {
          total: 0,
          count: 0
        };
      }

      // Add amount and increment count
      summary[payment.type].total += payment.amount;
      summary[payment.type].count += 1;

      return summary;
    }, {
      // Provide default structure to ensure all types are present
      wastage: { total: 0, count: 0 },
      less: { total: 0, count: 0 },
      collection: { total: 0, count: 0 }
    });
  };

  const paymentSummary = calculatePaymentSummary();

  const handlePaymentDetailsOpen = (type) => {
    setSelectedPaymentType(type);
    setPaymentDetailsOpen(true);
  };

  const filteredPaymentInfo = selectedPaymentType && customerData?.customer?.paymentInfo 
    ? customerData.customer.paymentInfo.filter(p => p.type === selectedPaymentType)
    : [];

  const handlePreviousAmountSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const newPreviousAmount = parseFloat(previousAmount) || 0;
      
      // Send only the previousAmount update
      const updatedData = {
        previousAmount: newPreviousAmount
      };

      console.log('Updating previous amount:', updatedData);

      const response = await axios.put(
        `http://localhost:5001/api/customers/${customerId}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        console.log('Update response:', response.data);
        
        // Fetch fresh data from the API to ensure consistency
        await fetchCustomerData();

        // Show success message
        alert('Previous amount updated successfully!');
      }

    } catch (error) {
      console.error('Error updating previous amount:', error);
      alert('Failed to update previous amount. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customerData || !customerData.customer) {
  return (
      <Box p={3}>
        <Typography color="error" align="center">
          {error || 'Could not load customer data'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/customers')}
          sx={{ mt: 2 }}
        >
          Back to Customers
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Previous Amount Input Box */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user?.role === 'admin' ? (
            <>
              <TextField
                label="Previous Amount"
                type="number"
                value={previousAmount}
                onChange={(e) => setPreviousAmount(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                onBlur={(e) => {
                  const value = e.target.value;
                  setPreviousAmount(value === '' ? 0 : parseFloat(value));
                }}
                inputProps={{
                  min: 0,
                  step: "0.01"
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>৳</span>
                }}
                sx={{ width: 200 }}
              />
              <Button 
                variant="contained" 
                color="primary"
                onClick={handlePreviousAmountSubmit}
              >
                Update Previous Amount
              </Button>
            </>
          ) : (
            <Typography variant="h6">
              Previous Amount: ৳{formatLargeNumber(previousAmount)}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Customer Header */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {customerData.customer.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon fontSize="small" />
                <Typography>{customerData.customer.mobile}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon fontSize="small" />
                <Typography>{customerData.customer.address}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Customer">
              <IconButton 
                onClick={() => setEditDialogOpen(true)}
                sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/customers')}
            >
              Back
            </Button>
          </Box>
        </Box>

        {/* Customer Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
              <Typography variant="subtitle2" color="textSecondary">Previous Amount</Typography>
              <Typography variant="h6" color="error.main">
                ৳{formatLargeNumber(customerData.stats.previousAmount)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Bill Amount</Typography>
              <Typography variant="h6">
                ৳{formatLargeNumber(customerData.stats.totalBillAmount)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Collection</Typography>
              <Typography variant="h6" color="success.main">
                ৳{formatLargeNumber(customerData.stats.totalCollection)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Less</Typography>
              <Typography variant="h6" color="warning.main">
                ৳{formatLargeNumber(customerData.stats.totalLess)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Remaining</Typography>
              <Typography variant="h6" color="error.main">
                ৳{formatLargeNumber(customerData.stats.totalRemaining)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Payment Summary */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Payment Summary
        </Typography>
        <Grid container spacing={2}>
          {['wastage', 'less', 'collection'].map((type) => (
            <Grid item xs={12} md={4} key={type}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { 
                    transform: 'scale(1.02)',
                    boxShadow: 4 
                  }
                }}
                onClick={() => handlePaymentDetailsOpen(type)}
              >
                <Box>
                  <Typography variant="subtitle1" textTransform="capitalize">
                    {type} Payments
                  </Typography>
                  <Typography variant="h6" color={
                    type === 'collection' ? 'success.main' : 'error.main'
                  }>
                    ৳{formatLargeNumber(
                      customerData.stats[`total${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0
                    )}
                  </Typography>
                </Box>
                <Chip 
                  label={`${paymentSummary[type]?.count || 0} Entries`} 
                  color={
                    type === 'collection' ? 'success' : 
                    type === 'less' ? 'secondary' : 
                    'warning'
                  } 
                />
                <Tooltip title="View Details">
                  <IconButton color="primary">
                    <DetailsIcon />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Payment Details Dialog */}
      <PaymentDetailsDialog 
        open={paymentDetailsOpen}
        onClose={() => setPaymentDetailsOpen(false)}
        paymentInfo={filteredPaymentInfo}
      />

      {/* Bills Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, mt: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bill ID</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bill Amount</TableCell>
              {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>Wastage</TableCell> */}
              {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>Less</TableCell> */}
              {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>Collection</TableCell> */}
              {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>Remains</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {customerData.bills.map((bill) => (
              <TableRow 
                key={bill._id}
                sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
              >
                <TableCell align="center">
                  {new Date(bill.date).toLocaleDateString('bn-BD')}
                </TableCell>
                <TableCell align="center">{bill.billNumber}</TableCell>
                <TableCell align="center">৳{formatLargeNumber(bill.total)}</TableCell>
                {/* <TableCell align="center">৳{formatLargeNumber(bill.wastageAmount)}</TableCell> */}
                {/* <TableCell align="center">৳{formatLargeNumber(bill.lessAmount)}</TableCell> */}
                {/* <TableCell align="center">৳{formatLargeNumber(bill.collectionAmount)}</TableCell> */}
                {/* <TableCell 
                  align="center"
                  sx={{ 
                    color: bill.remainingAmount > 0 ? 'error.main' : 'success.main',
                    fontWeight: 'medium'
                  }}
                >
                  ৳{formatLargeNumber(bill.remainingAmount)}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Customer Details</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Name"
              fullWidth
              value={editFormData.name}
              onChange={handleEditChange}
            />
            <TextField
              name="mobile"
              label="Mobile"
              fullWidth
              value={editFormData.mobile}
              onChange={handleEditChange}
            />
            <TextField
              name="address"
              label="Address"
              fullWidth
              multiline
              rows={2}
              value={editFormData.address}
              onChange={handleEditChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerDetails;
