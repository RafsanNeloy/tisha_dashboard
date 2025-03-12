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
  Tooltip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { formatLargeNumber } from '../../utils/bengaliNumerals';
import './customer_details.css';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    mobile: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers/${customerId}/bills`);
      setCustomerData(response.data);
      setEditFormData({
        name: response.data.customer.name,
        mobile: response.data.customer.mobile,
        address: response.data.customer.address
      });
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/customers/${customerId}`,
        editFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh customer data
      fetchCustomerData();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating customer:', error);
      // You might want to show an error message to the user
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Bill Amount</Typography>
              <Typography variant="h6">৳{formatLargeNumber(customerData.stats.totalBillAmount)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Collection</Typography>
              <Typography variant="h6">৳{formatLargeNumber(customerData.stats.totalCollection)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'white' }}>
              <Typography variant="subtitle2" color="textSecondary">Total Remaining</Typography>
              <Typography variant="h6" color="error.main">
                ৳{formatLargeNumber(customerData.stats.totalRemaining)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Bills Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bill ID</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bill Amount</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Wastage</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Less</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Collection</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Remains</TableCell>
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
                <TableCell align="center">৳{formatLargeNumber(bill.wastageAmount)}</TableCell>
                <TableCell align="center">৳{formatLargeNumber(bill.lessAmount)}</TableCell>
                <TableCell align="center">৳{formatLargeNumber(bill.collectionAmount)}</TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    color: bill.remainingAmount > 0 ? 'error.main' : 'success.main',
                    fontWeight: 'medium'
                  }}
                >
                  ৳{formatLargeNumber(bill.remainingAmount)}
                </TableCell>
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
