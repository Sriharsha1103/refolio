import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Grid, CardMedia, TextField, Button, Typography, Stack } from '@mui/material';
import { sha512 } from "js-sha512";
import Service from "../Service/http";
import CustomSnackbar from '../components/CustomComponents/CustomSnackbar';

const validPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');

const initialState = {
  oldPass: '',
  newPass: '',
  confirmPass: '',
  errors: { newPass: '', confirmPass: '' },
  snack: { open: false, message: '', severity: 'success' },
  loading: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'input':
      return { 
        ...state, 
        [action.field]: action.value, 
        errors: { ...state.errors, [action.field]: '' } 
      };
    case 'setError':
      return { 
        ...state, 
        errors: { ...state.errors, [action.field]: action.message } 
      };
    case 'openSnack':
      return { 
        ...state, 
        snack: { open: true, message: action.message, severity: action.severity } 
      };
    case 'closeSnack':
      return { 
        ...state, 
        snack: { ...state.snack, open: false } 
      };
    case 'setLoading':
      return {
        ...state,
        loading: action.value
      };
    default:
      return state;
  }
}

function ChangePasswordPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const loggedIn = useSelector((state) => state.logged);
  const verify = useSelector((state) => state.verify);
  const email = useSelector((state) => state.Email);
  const navigate = useNavigate();
  const service = new Service();

  useEffect(() => {
    if (!loggedIn) {
      navigate("../");
    } else if (!verify) {
      navigate("../verify");
    }
  }, [loggedIn, verify, navigate]);

  const handleChange = async () => {
    let hasError = false;

    // Validate New Password Regex
    if (!validPassword.test(state.newPass)) {
      dispatch({ 
        type: 'setError', 
        field: 'newPass', 
        message: 'Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char' 
      });
      hasError = true;
    }

    // Validate Confirmation Match
    if (state.newPass !== state.confirmPass) {
      dispatch({ type: 'setError', field: 'confirmPass', message: 'Passwords do not match' });
      hasError = true;
    }

    if (hasError) return;

    try {
      dispatch({ type: 'setLoading', value: true });
      // Verify Old Password
      const passHash = sha512(state.oldPass);
      await service.post('userlogin', { Email: email, Password: passHash });

      // Set New Password
      const newPassHash = sha512(state.newPass);
      await service.post('changePassword', { Email: email, Password: newPassHash });

      dispatch({ type: 'openSnack', message: 'Password Changed Successfully', severity: 200 });
      
      setTimeout(() => {
        navigate('../home');
      }, 1500);

    } catch (e) {
      dispatch({ type: 'openSnack', message: 'Wrong current password or server error', severity: 500 });
    } finally {
      dispatch({ type: 'setLoading', value: false });
    }
  };

  const inputsDisabled = state.loading || state.snack.open;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        height: "90vh",
        width: "100vw",
        backgroundColor: "#c5d299",
        paddingTop: "90px"
      }}
    >
      <Card sx={{ maxHeight: '450px', maxWidth: '900px', width: '100%' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid item xs={12} md={8} sx={{ display: { xs: 'none', md: 'block' } }}>
            <CardMedia
              component="img"
              height="100%"
              image={require('../static/hompage.jpg')}
              alt="homepage"
              sx={{ objectFit: 'cover', height: '100%' }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 3
            }}
          >
            <Typography variant="h5" sx={{ color: '#6C9449', mb: 2, textAlign: 'center' }}>
              Change Password
            </Typography>
            
            <Stack component="form" onSubmit={(e)=>{ e.preventDefault(); if (!inputsDisabled) handleChange(); }} spacing={2}>
              <TextField
                label="Old Password"
                type="password"
                variant="outlined"
                size="small"
                fullWidth
                value={state.oldPass}
                onChange={(e) => dispatch({ type: 'input', field: 'oldPass', value: e.target.value })}
                disabled={inputsDisabled}
              />
              
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                size="small"
                fullWidth
                error={!!state.errors.newPass}
                helperText={state.errors.newPass}
                value={state.newPass}
                onChange={(e) => dispatch({ type: 'input', field: 'newPass', value: e.target.value })}
                disabled={inputsDisabled}
              />

              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                size="small"
                fullWidth
                error={!!state.errors.confirmPass}
                helperText={state.errors.confirmPass}
                value={state.confirmPass}
                onChange={(e) => dispatch({ type: 'input', field: 'confirmPass', value: e.target.value })}
                disabled={inputsDisabled}
              />

              <Button 
                variant="contained" 
                color="secondary" 
                type="submit"
                disabled={inputsDisabled}
                sx={{ mt: 1 }}
              >
                {state.loading ? 'Changing...' : 'Change'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <CustomSnackbar
        open={state.snack.open}
        message={state.snack.message}
        severity={state.snack.severity}
        handleClose={() => dispatch({ type: 'closeSnack' })}
      />
    </Box>
  );
}

export default ChangePasswordPage;