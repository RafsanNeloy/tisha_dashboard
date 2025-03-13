import React from 'react';
import { Typography, Box } from '@mui/material';
import { formatLargeNumber } from '../../utils/bengaliNumerals';

const AmountHighlight = ({ 
  total, 
  remaining, 
  totalLabel = 'Total Amount', 
  remainingLabel = 'Remaining Amount' 
}) => {
  const getTotalColor = () => {
    if (total > 10000) return 'success.main';
    if (total > 5000) return 'warning.main';
    return 'error.main';
  };

  const getRemainingColor = () => {
    if (remaining === 0) return 'success.main';
    if (remaining < 1000) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 2,
        p: 2,
        backgroundColor: '#f4f4f4',
        borderRadius: 2
      }}
    >
      <Box>
        <Typography variant="subtitle1" color="text.secondary">
          {totalLabel}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: getTotalColor(),
            fontWeight: 'bold'
          }}
        >
          ৳{formatLargeNumber(total)}
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle1" color="text.secondary">
          {remainingLabel}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: getRemainingColor(),
            fontWeight: 'bold'
          }}
        >
          ৳{formatLargeNumber(remaining)}
        </Typography>
      </Box>
    </Box>
  );
};

export default AmountHighlight; 