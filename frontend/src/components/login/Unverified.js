import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/http";
import { useDispatch, useSelector } from "react-redux";
import { Signout } from "./Actions";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";

const initialState = {
    loading: false,
    snack: { open: false, status: 0, message: "" },
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.value };
        case "SHOW_SNACK":
            return { ...state, snack: { open: true, status: action.status, message: action.message } };
        case "HIDE_SNACK":
            return { ...state, snack: { ...state.snack, open: false } };
        default:
            return state;
    }
}

function Unverified() {
    const navigate = useNavigate();
    const service = new Service();
    const verify = useSelector((state) => state.verify);
    const email = useSelector((state) => state.Email);
    const loggedIn = useSelector((state) => state.logged);
    const dispatch = useDispatch();

    const [state, localDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!loggedIn) {
            navigate("../");
            return;
        }
        if (verify) {
            navigate("../home");
            return;
        }
        if (!verify && loggedIn) {
            localDispatch({ type: "SET_LOADING", value: true });
            service
                .post("unverified", { Email: email })
                .then(() => {
                    localDispatch({ type: "SHOW_SNACK", status: 200, message: "Verification email sent. Please check your inbox." });
                })
                .catch((err) => {
                    console.error(err);
                    localDispatch({ type: "SHOW_SNACK", status: 500, message: "Failed to send verification email." });
                })
                .finally(() => localDispatch({ type: "SET_LOADING", value: false }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!verify) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", px: 2 }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                        Your email is not verified yet
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Please verify your account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        We have sent you an email for account verification.
                    </Typography>
                    {state.loading ? (
                        <CircularProgress size={28} />)
                        : null}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            navigate("../");
                            localStorage.clear();
                            dispatch(Signout());
                        }}
                    >
                        Back to Login Page
                    </Button>
                </Stack>

                <CustomSnackbar
                    open={state.snack.open}
                    status={state.snack.status}
                    message={state.snack.message}
                    handleClose={() => localDispatch({ type: "HIDE_SNACK" })}
                />
            </Box>
        );
    }
}

export default Unverified;