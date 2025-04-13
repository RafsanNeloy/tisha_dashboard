import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const useDrawerState = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Initialize from localStorage if available
  const storedDrawerState = localStorage.getItem('drawerOpen');
  const initialDrawerState = storedDrawerState !== null ? 
      storedDrawerState === 'true' : 
      !isMobile;
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(initialDrawerState);
  const drawerWidth = isDrawerOpen ? 260 : 64;

  // Update localStorage when drawer state changes
  useEffect(() => {
    localStorage.setItem('drawerOpen', isDrawerOpen.toString());
    localStorage.setItem('drawerWidth', drawerWidth.toString());
  }, [isDrawerOpen, drawerWidth]);

  // Close drawer on mobile
  useEffect(() => {
    if (isMobile && isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [isMobile, isDrawerOpen]);

  return {
    isDrawerOpen,
    setIsDrawerOpen,
    drawerWidth,
    isMobile
  };
};

export default useDrawerState; 