import React, { useState } from 'react'
import { Typography, TextField, Box, Divider, useTheme, useMediaQuery } from '@mui/material'
import moment from 'moment'
import { englishToBengali } from '../../../utils/bengaliNumerals'

const BillDetail = (props) => {
  const { id, customer, bill, onAddressChange } = props;
  const [address, setAddress] = useState(customer?.address || '');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (onAddressChange) {
      onAddressChange(e.target.value);
    }
  };

  const discountPercentage = bill?.discountPercentage || 0;
  const discountAmount = bill?.discountAmount || 0;
  const additionalPrice = bill?.additionalPrice || 0;

  return (
    <Box sx={{
      p: 2,
      transition: 'all 0.3s ease',
    }}>
      <Box sx={{
        mb: 3,
      }}>
        <Typography 
          variant={isMobile ? 'h6' : 'h5'} 
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          <strong>বিল নং:</strong> {englishToBengali(bill?.billNumber)}
        </Typography>
        <Typography 
          variant={isMobile ? 'subtitle1' : 'h6'} 
          gutterBottom
          sx={{ fontWeight: 'medium' }}
        >
          <strong>গ্রাহকের নাম:</strong> {customer?.name || 'Loading...'}
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="গ্রাহকের ঠিকানা"
        multiline
        rows={2}
        value={address}
        onChange={handleAddressChange}
        placeholder="গ্রাহকের ঠিকানা লিখুন"
        variant="outlined"
        sx={{
          my: 2,
          transition: 'all 0.3s ease',
        }}
      />

      <Typography 
        variant="subtitle1" 
        gutterBottom
        sx={{ mb: 2 }}
      >
        <strong>অর্ডারের তারিখ ও সময়:</strong>{' '}
        {moment(bill?.createdAt).format('DD/MM/YYYY, hh:mm A')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        },
      }}>
        <Typography variant="h6">
          <strong>সাবটোটাল:</strong> ৳{englishToBengali(bill?.items?.reduce((sum, item) => sum + item.subTotal, 0) || 0)}
        </Typography>

        {discountAmount > 0 && (
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'success.main',
              transition: 'color 0.3s ease',
            }}
          >
            <strong>(-) ডিসকাউন্ট ({englishToBengali(discountPercentage)}%):</strong>{' '}
            ৳{englishToBengali(discountAmount)}
          </Typography>
        )}

        {additionalPrice > 0 && (
          <Typography 
            variant="h6"
            sx={{ 
              color: 'info.main',
              transition: 'color 0.3s ease',
            }}
          >
            <strong>(+) সার্ভিস চার্জ:</strong> ৳{englishToBengali(additionalPrice)}
          </Typography>
        )}

        <Typography 
          variant="h6" 
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'primary.main',
            p: 2,
            borderRadius: 1,
            bgcolor: 'primary.light',
            opacity: 0.9,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'primary.light',
              opacity: 1,
            },
          }}
        >
          <strong>সর্বমোট:</strong> ৳{englishToBengali(bill?.total)}
        </Typography>
      </Box>
    </Box>
  );
};

export default BillDetail;