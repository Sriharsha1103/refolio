import React, { useReducer } from "react";
import { useDispatch } from "react-redux";
import Service from "../Service/http";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CustomSnackbar from "../components/CustomComponents/CustomSnackbar";
import { Login } from "../store/Actions";
import { useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  loading: false,
  snack: { open: false, status: 0, message: "" },
  errors: { email: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "input":
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: "" },
      };
    case "setLoading":
      return { ...state, loading: action.value };
    case "setError":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case "openSnack":
      return {
        ...state,
        snack: { open: true, status: action.status, message: action.message },
      };
    case "closeSnack":
      return { ...state, snack: { ...state.snack, open: false } };
    default:
      return state;
  }
}

function Forgot() {
  const service = new Service();
  const dispatchRedux = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!state.email.trim()) {
      dispatch({
        type: "setError",
        field: "email",
        message: "Email is required",
      });
      return;
    }
    const e = state.email + "@bvrithyderabad.edu.in";
    dispatch({ type: "setLoading", value: true });
    service
      .post("forgot", { Email: e })
      .then(() => {
        dispatch({
          type: "openSnack",
          status: 200,
          message: "Reset link sent. Please check your email.",
        });
      })
      .catch(() => {
        dispatch({
          type: "openSnack",
          status: 404,
          message: "Email not found.",
        });
      })
      .finally(() => dispatch({ type: "setLoading", value: false }));
  };

  const handleSnackClose = () => {
    dispatch({ type: "closeSnack" });
    if (state.snack.status >= 200 && state.snack.status < 300) {
    //   navigate("/login");
        dispatchRedux(Login())
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Stack spacing={2} sx={{ width: "85%" }}>
        <Typography variant="h5" sx={{ color: "#6C9449", textAlign: "center" }}>
          Forgot Password
        </Typography>

        <TextField
          label="Registered Email ID"
          variant="outlined"
          fullWidth
          value={state.email}
          error={!!state.errors.email}
          helperText={state.errors.email}
          onChange={(e) =>
            dispatch({ type: "input", field: "email", value: e.target.value })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                @bvrithyderabad.edu.in
              </InputAdornment>
            ),
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => dispatchRedux(Login())}
          >
            Back
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            disabled={state.loading}
            onClick={handleSubmit}
          >
            {state.loading ? "Sending..." : "Send Code"}
          </Button>
        </Stack>

        <CustomSnackbar
          open={state.snack.open}
          status={state.snack.status}
          message={state.snack.message}
          handleClose={handleSnackClose}
        />
      </Stack>
    </Box>
  );
}

export default Forgot;
