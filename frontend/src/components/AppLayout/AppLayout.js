import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw' }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
