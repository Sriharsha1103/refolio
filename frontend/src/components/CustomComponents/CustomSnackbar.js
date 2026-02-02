import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CustomSnackbar = ({ open, handleClose, status, message, customautoHideDuration = 3000 }) => {

  const getSeverity = (code) => {
    if (!code) return 'info';
    const statusCode = Number(code);
    
    if (statusCode >= 200 && statusCode < 300) return 'success';
    if (statusCode >= 300 && statusCode < 400) return 'warning';
    if (statusCode >= 400 && statusCode < 600) return 'error';
    return 'info';
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={customautoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={getSeverity(status)} 
        sx={{ width: '100%' }}
        variant="filled"
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
