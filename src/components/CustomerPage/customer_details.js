import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import './customer_details.css';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const demoData = [
    {
      date: '১১/২/২০২৫',
      billId: '02',
      westage: 500,
      less: 0,
      billAmount: 0,
      collection: 0,
      remains: -500
    },
    {
      date: '১৩/২/২০২৫',
      billId: '01',
      westage: 0,
      less: 0,
      billAmount: 1000,
      collection: 0,
      remains: 1000
    }
  ];

  return (
    <div className="details-page-container">
      <div className="details-header">
        <h2>Customer Details</h2>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/customers')}
        >
          Back
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Bill ID</TableCell>
              <TableCell align="center">Westage</TableCell>
              <TableCell align="center">Less</TableCell>
              <TableCell align="center">Bill Amount</TableCell>
              <TableCell align="center">Collection</TableCell>
              <TableCell align="center">Remains</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demoData.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="center">{row.billId}</TableCell>
                <TableCell align="center">{row.westage}</TableCell>
                <TableCell align="center">{row.less}</TableCell>
                <TableCell align="center">{row.billAmount}</TableCell>
                <TableCell align="center">{row.collection}</TableCell>
                <TableCell align="center">{row.remains}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CustomerDetails;
