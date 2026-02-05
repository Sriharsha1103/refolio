import React, { useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  TextField,
  Autocomplete,
  Card,
  CardContent,
  Grid,
  Container,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Select as MUISelect,
  MenuItem,
} from "@mui/material";
import Service from '../../Service/http';
import { Departments, ConsultancyKey } from '../../Service/keyValueMap';
import { useDispatch, useSelector } from 'react-redux';
import { Tab } from "../../store/Actions";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";


function NewConsultancy() {
  const containsIgnoreCase = (array, searchString) => {
    const lowerCaseSearch = searchString.toLowerCase();
    return array.some(item => item.toLowerCase() === lowerCaseSearch);
  }
  
  const yearpre = new Date();
  const years = [];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }
  const loggedIn = useSelector((state)=>state.logged);
  const verify = useSelector((state)=>state.verify);
  const isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
  const isAdmin = useSelector((state)=>state.isAdmin);
  const service = new Service();
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    dept: "",
    ngo: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    status: null,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bodyInitialState = {
    title : "",
    industry: "",
    ngo : "",
    pi : "",
    co_pi  : "",
    dept : [],
    amount : "",
  };

  const bodyReducer = (state, action) => {
    switch (action.type) {
      case 'SET_FIELD':
        return {
          ...state,
          [action.field]: action.value,
        };
      case 'SET_MULTIPLE':
        return {
          ...state,
          ...action.payload,
        };
      case 'RESET':
        return bodyInitialState;
      default:
        return state;
    }
  };

  const [body, dispatchBody] = useReducer(bodyReducer, bodyInitialState);

  const [cjb, setCjb] = useState([]);
  const [ngo, setNGO] = useState("");
  const [titles, setTitles] = useState([]);

  const navigate = useNavigate();
  
  const handleSnackbarClose = (_,reason) => {
    if (reason === "clickaway") return;
    setSnackbarConfig((prev) => ({ ...prev, open: false }));
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSubmission = () => {
    setConfirmOpen(false);
    setIsSubmitting(true);
    service
      .post("api/consultancy/data", body)
      .then(() => {
        setSnackbarConfig({
          open: true,
          status: 200,
          message: `Succesfully Added ${body.title}`,
        });
        navigate("/consultancy");
      })
      .catch((error) => {
        console.log(error);
        setSnackbarConfig({
          open: true,
          status: 500,
          message: `Error while adding ${body.title}. Please Try again later.`,
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const runValidation = () => {
    const errors = {
      title: "",
      dept: "",
      ngo: "",
    };
    const sanitizedTitle = body.title.replace(/\s+/g, " ").trim();
    if (sanitizedTitle && containsIgnoreCase(titles, sanitizedTitle)) {
      errors.title = "Title Already exists";
    }
    if (cjb.length === 0) {
      errors.dept = "Please select a value.";
    }
    if (!ngo) {
      errors.ngo = "Please select a value.";
    }
    setValidationErrors(errors);
    return !errors.title && !errors.dept && !errors.ngo;
  };

  const handleFieldChange = (field, value) => {
    let updatedValue = value;
    if (field === "title") {
      updatedValue = updatedValue.replace(/\s+/g, " ");
      const duplicateTitle =
        updatedValue && containsIgnoreCase(titles, updatedValue);
      setValidationErrors((prev) => ({
        ...prev,
        title: duplicateTitle ? "Title Already exists" : "",
      }));
    }

    if (field === "dept") {
      const deptValues = Array.isArray(updatedValue) ? updatedValue : [];
      setCjb(deptValues);
      setValidationErrors((prev) => ({
        ...prev,
        dept: deptValues.length === 0 ? "Please select a value." : "",
      }));
      updatedValue = deptValues;
    }

    if (field === "ngo") {
      setNGO(updatedValue);
      setValidationErrors((prev) => ({
        ...prev,
        ngo: updatedValue ? "" : "Please select a value.",
      }));
    }

    dispatchBody({
      type: "SET_FIELD",
      field,
      value: updatedValue,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!runValidation()) return;
    setConfirmOpen(true);
  };

  useEffect(()=>{
    dispatch(Tab('new-consultancy'));
    if(!loggedIn){
        navigate("../")}
    else if(!verify){
      navigate("../verify")
    }else if(isSuperAdmin){
      navigate("../consultancy")
    }
    if(titles.length==0){
    service.get('api/consultancy/titles').then((res)=>{
      // console.log('titles',res)
      setTitles(res);
      // console.log("inside",titles)
    }).catch((error)=>{
      console.log("ERROR",error)
    })
  }
  },[])
  return (
    <>
      <div
        style={{
          height: "88vh",
          width: "100wh",
          backgroundColor: "#c5d299",
        }}
      >
        {/* <br/> */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <form id="insert-data" onSubmit={onSubmit}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ color: "#6C9449", fontWeight: 500 }}
                    >
                      Consultancy Project Information
                    </Typography>

                    <TextField
                      label={ConsultancyKey.title}
                      placeholder={ConsultancyKey.title}
                      id="title"
                      required
                      fullWidth
                      margin="normal"
                      value={body.title}
                      onChange={(event) => handleFieldChange("title", event.target.value)}
                      error={!!validationErrors.title}
                      helperText={validationErrors.title}
                    />

                    <TextField
                      label={ConsultancyKey.pi + '  (Add multiple authors seperated by ",")'}
                      id="authors"
                      placeholder={ConsultancyKey.pi}
                      required
                      fullWidth
                      margin="normal"
                      value={body.pi}
                      onChange={(event) => handleFieldChange("pi", event.target.value)}
                    />

                    <TextField
                      label={ConsultancyKey.co_pi+'  (Add multiple authors seperated by ",")'}
                      id="co_authors"
                      placeholder={ConsultancyKey.co_pi}
                      required
                      fullWidth
                      margin="normal"
                      value={body.co_pi}
                      onChange={(event) => handleFieldChange("co_pi", event.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2} sx={{ mt: { xs: 0, md: 4 } }}>
                      <Grid item xs={12} md={6}>
                        <Autocomplete
                          multiple
                          disableCloseOnSelect
                          options={Departments}
                          value={cjb}
                          onChange={(_, value) => handleFieldChange("dept", value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={ConsultancyKey.dept}
                              placeholder={cjb.length === 0 ? "Select At least One" : "Type to search"}
                              error={!!validationErrors.dept}
                              helperText={validationErrors.dept}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required error={!!validationErrors.ngo}>
                          <InputLabel id="ngo-label">{ConsultancyKey.ngo}</InputLabel>
                          <MUISelect
                            labelId="ngo-label"
                            id="ngo"
                            label={ConsultancyKey.ngo}
                            value={ngo}
                            onChange={(event) => handleFieldChange("ngo", event.target.value)}
                          >
                            <MenuItem value="Private">Private</MenuItem>
                            <MenuItem value="Public">Public</MenuItem>
                            <MenuItem value="NGO">NGO</MenuItem>
                          </MUISelect>
                          {validationErrors.ngo && (
                            <FormHelperText>{validationErrors.ngo}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>

                    <TextField
                      label={ConsultancyKey.industry}
                      placeholder="Enter Industry"
                      id="industry"
                      required
                      fullWidth
                      margin="normal"
                      value={body.industry}
                      onChange={(event) => handleFieldChange("industry", event.target.value)}
                    />

                    <TextField
                      label={ConsultancyKey.amount}
                      placeholder="Enter Amount"
                      id="amount"
                      required
                      fullWidth
                      margin="normal"
                      value={body.amount}
                      onChange={(event) => handleFieldChange("amount", event.target.value)}
                    />

                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      form="insert-data"
                      disabled={isSubmitting}
                      sx={{ mt: 2 }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      </div>
      <CustomConfirmDialog
        open={confirmOpen}
        handleClose={handleConfirmClose}
        handleConfirm={handleConfirmSubmission}
        title="Confirm Submission"
        content="This action will add the data into the Database."
      />
      <CustomSnackbar
        open={snackbarConfig.open}
        handleClose={handleSnackbarClose}
        status={snackbarConfig.status}
        message={snackbarConfig.message}
      />
    </>
  );
}

export default NewConsultancy;