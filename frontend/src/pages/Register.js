import React, { useReducer } from "react";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { sha512 } from 'js-sha512'
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, InputAdornment } from "@mui/material";
import Service from "../Service/http";
import { BRANCH_OPTIONS } from "../utils/constants";
import CustomSnackbar from "../components/CustomComponents/CustomSnackbar";
import { useNavigate } from "react-router-dom";

const initialState = {
    Name: '',
    Branch: '',
    Email: '',
    Password: '',
    CPass: '',
    errors: {},
    loading: false
};

function reducer(state, action) {
    if (action.type === 'input') {
        return {
            ...state,
            [action.field]: action.value,
            errors: {
                ...state.errors,
                [action.field]: '' // Clear error when user types
            }
        };
    } else if (action.type === 'setErrors') {
        return {
            ...state,
            errors: action.errors
        };
    } else if (action.type === 'setLoading') {
        return {
            ...state,
            loading: action.value
        };
    }
    return state;
}

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const service = new Service();
    
    const [state, localDispatch] = useReducer(reducer, initialState);
    const { Name, Branch, Email, Password, CPass, errors } = state;

    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleChange = (field, value) => {
        localDispatch({
            type: 'input',
            field: field,
            value: value
        });
    };

    function check() {
        const newErrors = {};
        let isValid = true;
        
        if (!Name.trim()) {
            newErrors.Name = 'Name is required';
            isValid = false;
        }
        if (!Email.trim()) {
            newErrors.Email = 'Email is required';
            isValid = false;
        }
        if (!Branch) {
            newErrors.Branch = 'Branch is required';
            isValid = false;
        }
        
        if (!validPassword.test(Password)) {
            newErrors.Password = 'Must contain uppercase, lowercase, number, special char, and be 8+ chars';
            isValid = false;
        }
        
        if (Password !== CPass) {
            newErrors.CPass = 'Passwords do not match';
            isValid = false;
        }

        localDispatch({ type: 'setErrors', errors: newErrors });
        return isValid;
    }

    useEffect(() => {
        //console.log(Name,Email,Password,CPass)
    }, [Name, Email, Password, CPass]);

    function send(Name, Email, Password) {
        localDispatch({ type: 'setLoading', value: true });
        var e = Email + '@bvrithyderabad.edu.in';
        var Pas = sha512(Password);
        service.post('registerme', { Name, Email: e, Password: Pas, branch: Branch })
            .then((res) => {
                showSnackbar('Successful Registration. Redirecting to login page', 'success');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            })
            .catch((e) => {
                showSnackbar('ERROR while Registering the user.', 'error');
                console.log(e);
            })
            .finally(() => {
                localDispatch({ type: 'setLoading', value: false });
            });
    }

    return (
        <Box component="form" onSubmit={(e)=>{ e.preventDefault(); const inputsDisabled = state.loading || snackbarOpen; if (!inputsDisabled && check()) { send(Name, Email, Password, Branch); } }} sx={{ width: '100%', height: '100%', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CustomSnackbar 
                open={snackbarOpen} 
                handleClose={handleSnackbarClose} 
                severity={snackbarSeverity} 
                message={snackbarMessage} 
            />
            <Typography variant="h5" sx={{ color: '#6C9449', fontWeight: 'bold' }}>
                Sign up for an account
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={Name}
                    error={!!errors.Name}
                    helperText={errors.Name}
                    onChange={(e) => handleChange('Name', e.target.value)}
                    disabled={state.loading || snackbarOpen}
                />
                <FormControl fullWidth error={!!errors.Branch}>
                    <InputLabel id="branch-select-label">Branch</InputLabel>
                    <Select
                        labelId="branch-select-label"
                        id="branch"
                        value={Branch}
                        label="Branch"
                        onChange={(e) => handleChange('Branch', e.target.value)}
                        disabled={state.loading || snackbarOpen}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {BRANCH_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.Branch && <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>{errors.Branch}</Typography>}
                </FormControl>
            </Box>

            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={Email}
                error={!!errors.Email}
                helperText={errors.Email}
                onChange={(e) => handleChange('Email', e.target.value)}
                disabled={state.loading || snackbarOpen}
                InputProps={{
                    endAdornment: <InputAdornment position="end">@bvrithyderabad.edu.in</InputAdornment>,
                }}
            />

            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={Password}
                error={!!errors.Password}
                helperText={errors.Password}
                onChange={(e) => handleChange('Password', e.target.value)}
                disabled={state.loading || snackbarOpen}
            />

            <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={CPass}
                error={!!errors.CPass}
                helperText={errors.CPass}
                onChange={(e) => handleChange('CPass', e.target.value)}
                disabled={state.loading || snackbarOpen}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate('/login')}
                >
                    Login
                </Typography>
                <Button
                    variant="contained"
                    color='secondary'
                    type="submit"
                    disabled={state.loading || snackbarOpen}
                >
                    {state.loading ? 'Registering...' : 'Register'}
                </Button>
            </Box>
        </Box>
    );
}

export default Register;