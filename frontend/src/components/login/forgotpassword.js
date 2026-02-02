import React, { useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Comp.css";
import { sha512 } from "js-sha512";
import { 
  Button, 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  Box 
} from "@mui/material";
import Service from "../../Service/http";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";

const initialState = {
  verified: true, // Initially true to hide form until verified false
  email: "",
  password: "",
  confirmPassword: "",
  errors: {
    password: "",
    confirmPassword: "",
  },
  snackbar: {
    open: false,
    message: "",
    severity: "info",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_VERIFIED":
      return { ...state, verified: action.payload.verified, email: action.payload.email };
    case "SET_EXPIRED":
      return { ...state, verified: true };
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: "" }, // Clear error on change
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case "OPEN_SNACKBAR":
      return {
        ...state,
        snackbar: { open: true, message: action.message, severity: action.severity },
      };
    case "CLOSE_SNACKBAR":
      return {
        ...state,
        snackbar: { ...state.snackbar, open: false },
      };
    default:
      return state;
  }
}

function Forgotpassword() {
  const service = new Service();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { id } = useParams();

  useEffect(() => {
    service
      .post("forgotpassword", { id: { id } }) // Ensure correct payload structure depending on your backend
      .then((res) => {
        dispatch({ type: "SET_VERIFIED", payload: { verified: res.verified, email: res.Email } });
      })
      .catch((e) => {
        dispatch({ type: "SET_EXPIRED" });
      });
  }, [id]); // proper dependency

  const validPassword = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  const validate = () => {
    let isValid = true;
    if (!validPassword.test(state.password)) {
      dispatch({
        type: "SET_ERROR",
        field: "password",
        message: "Must include uppercase, lowercase, number, special char & be 8+ chars.",
      });
      isValid = false;
    }
    if (state.password !== state.confirmPassword) {
      dispatch({
        type: "SET_ERROR",
        field: "confirmPassword",
        message: "Passwords do not match.",
      });
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      const pas = sha512(state.password);
      service
        .post("newpassword", {
          Email: state.email,
          Password: pas,
        })
        .then((res) => {
          dispatch({ type: "OPEN_SNACKBAR", message: "Changed Successfully. Redirecting...", severity: 200 });
          setTimeout(() => navigate("../"), 2000);
        })
        .catch((e) => {
          dispatch({ type: "OPEN_SNACKBAR", message: "Link already used or invalid.", severity: 400 });
        });
    }
  };

  const handleCloseSnackbar = () => {
    dispatch({ type: "CLOSE_SNACKBAR" });
  };

  if (!state.verified) {
    return (
      <Grid 
        container 
        justifyContent="center" 
        alignItems="center" 
        style={{ minHeight: "100vh", backgroundColor: "#c5d299" }}
      >
        <Paper elevation={4} sx={{ maxWidth: 900, width: "100%", overflow: 'hidden' }}>
          <Grid container>
            <Grid item xs={12} md={8}>
              <img 
                src={require("../static/hompage.jpg")} 
                alt="Homepage" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h5" sx={{ color: "#6C9449", mb: 3 }}>
                Change Password
              </Typography>
              
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={state.password}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })}
                error={!!state.errors.password}
                helperText={state.errors.password}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={state.confirmPassword}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "confirmPassword", value: e.target.value })}
                error={!!state.errors.confirmPassword}
                helperText={state.errors.confirmPassword}
              />

              <Box mt={3}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                  onClick={handleSubmit}
                >
                  Change
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <CustomSnackbar
          open={state.snackbar.open}
          message={state.snackbar.message}
          severity={state.snackbar.severity}
          onClose={handleCloseSnackbar}
        />
      </Grid>
    );
  } else {
    // Note: The original logic meant if Verified is TRUE, it was an error/expired link because 
    // the API returns verified=false if the reset is allowed. 
    // However, the catch block sets Comp=true which rendered the error.
    // Preserving the render logic for "Invalid link".
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h4">Invalid link or Link Expired</Typography>
      </Box>
    );
  }
}
export default Forgotpassword;
