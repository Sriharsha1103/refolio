import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Service from "../Service/http";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CustomSnackbar from "../components/CustomComponents/CustomSnackbar";

const initialState = {
    loading: true,
    verified: null, // true | false | null
    snack: { open: false, status: 0, message: "" },
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.value };
        case "SET_VERIFIED":
            return { ...state, verified: action.value };
        case "SHOW_SNACK":
            return { ...state, snack: { open: true, status: action.status, message: action.message } };
        case "HIDE_SNACK":
            return { ...state, snack: { ...state.snack, open: false } };
        default:
            return state;
    }
}

function VerifiedEmail() {
    const service = new Service();
    const navigate = useNavigate();
    const params = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const payload = { id: params };
        service
            .post("verifyemail", payload)
            .then(() => {
                dispatch({ type: "SET_VERIFIED", value: true });
                dispatch({ type: "SHOW_SNACK", status: 200, message: "Your email has been verified successfully." });
            })
            .catch(() => {
                dispatch({ type: "SET_VERIFIED", value: false });
                dispatch({ type: "SHOW_SNACK", status: 400, message: "Invalid or expired verification link." });
            })
            .finally(() => dispatch({ type: "SET_LOADING", value: false }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", px: 2 }}>
            <Stack spacing={2} alignItems="center" textAlign="center">
                {state.loading ? (
                    <>
                        <CircularProgress size={28} />
                        <Typography variant="h6" color="text.secondary">Verifying your email…</Typography>
                    </>
                ) : state.verified ? (
                    <>
                        <Typography variant="h4" fontWeight={700} color="text.primary">
                            Your email is verified
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("../")}>Go to Login</Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h4" fontWeight={700} color="text.primary">
                            Invalid or expired link
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please request a new verification email from the login page.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("../")}>Back to Login</Button>
                    </>
                )}

                <CustomSnackbar
                    open={state.snack.open}
                    status={state.snack.status}
                    message={state.snack.message}
                    handleClose={() => dispatch({ type: "HIDE_SNACK" })}
                />
            </Stack>
        </Box>
    );
}

export default VerifiedEmail;
