import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ErrorPage = () => {
  const navigate = useNavigate();
  const loggedIn = useSelector((state)=>state.logged);

  const handleNavigation = () => {
    if (loggedIn) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '88vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" color="primary" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </Typography>

        <Button 
          variant="contained" 
          size="large" 
          onClick={handleNavigation}
        >
          {loggedIn ? 'Back to Dashboard' : 'Go to Login'}
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
