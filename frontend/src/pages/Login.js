import React, { useReducer, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Signin } from "../store/Actions";
import { useNavigate } from 'react-router-dom'
import { sha512 } from "js-sha512";
import { Button, TextField, InputAdornment, Typography, Box, Container, Backdrop, CircularProgress } from "@mui/material"; 
import Service from "../Service/http";
import CustomSnackbar from "../components/CustomComponents/CustomSnackbar";

const initialState = {
    email: '',
    password: '',
    loading: false,
    error: null
};

function loginReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return { ...state, loading: false };
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
}

function Login() {
    const [state, localDispatch] = useReducer(loginReducer, initialState);
    const service = new Service();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedIn = useSelector((state) => state.logged);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState(300);
    // Temporary state to hold login data until snackbar closes
    const [tempLoginData, setTempLoginData] = useState(null);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        
        // If we have pending login data, dispatch signin now
        if (tempLoginData) {
            console.log('Users are', tempLoginData.Email, tempLoginData.Name, tempLoginData);
            dispatch(Signin(
                tempLoginData.Email, 
                tempLoginData.Name, 
                tempLoginData.role === "admin", 
                tempLoginData.role === "super-admin", 
                tempLoginData.verified,
                tempLoginData.profileId
            ));
            setTempLoginData(null); 
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        if (loggedIn) {
            navigate('../home')
        }
    }, [loggedIn, navigate]);

    const handleLogin = () => {
        if (!state.email.trim() || !state.password.trim()) {
            const errorMsg = 'Email and password are required';
            localDispatch({ type: 'LOGIN_FAILURE', error: errorMsg });
            showSnackbar(errorMsg, 400);
            return;
        }

        localDispatch({ type: 'LOGIN_START' });
        var email = state.email + '@bvrithyderabad.edu.in';
        var pas = sha512(state.password);
        
        service.post('userlogin', { Email: email, Password: pas })
            .then((res) => {
                localDispatch({ type: 'LOGIN_SUCCESS' });
                showSnackbar('Login successful!', 200);
                setTempLoginData(res);
            })
            .catch((e) => {
                console.log("error", e);
                const errorMsg = 'Invalid Credentials';
                localDispatch({ type: 'LOGIN_FAILURE', error: errorMsg });
                showSnackbar(errorMsg, 'error');
            });
    };

    const inputsDisabled = state.loading || snackbarOpen;

    return (
        <Container maxWidth="sm">
            <CustomSnackbar 
                open={snackbarOpen} 
                handleClose={handleSnackbarClose} 
                status={snackbarSeverity} 
                message={snackbarMessage} 
                customautoHideDuration={1000}
            />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={state.loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
                component="form"
                onSubmit={(e) => { e.preventDefault(); if (!inputsDisabled) handleLogin(); }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: 5,
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: 'white'
                }}
            >
                <Typography variant="h5" component="div" className="Heading" color="primary">
                    Sign in to your account
                </Typography>

                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={state.email}
                    onChange={(e) => localDispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                    disabled={inputsDisabled}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">@bvrithyderabad.edu.in</InputAdornment>,
                    }}
                />

                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={state.password}
                    onChange={(e) => localDispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
                    disabled={inputsDisabled}
                />

                <Button 
                    variant="contained" 
                    color='secondary' 
                    type="submit"
                    disabled={inputsDisabled}
                    size="large"
                >
                    {state.loading ? 'Logging in...' : 'Login'}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography 
                        variant="body2" 
                        color="primary" 
                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="primary" 
                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate('/forgot')}
                    >
                        Forgot Password?
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
export default Login;