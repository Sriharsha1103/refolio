import React, { useEffect, useState, useReducer, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
import Service from "../../Service/http";
import { Departments, ResearchKey } from "../../Service/keyValueMap";
import { useDispatch, useSelector } from "react-redux";
import { Tab } from "../../store/Actions";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import { primaryColor, white } from "../../utils/colors";

function NewResearch() {
  const containsIgnoreCase = (array, searchString) => {
    const lowerCaseSearch = (searchString || "").toLowerCase();
    return array.some((item) => (item || "").toLowerCase() === lowerCaseSearch);
  };

  const yearpre = new Date();
  const years = [];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }

  const loggedIn = useSelector((state) => state.logged);
  const verify = useSelector((state) => state.verify);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);
  const dispatch = useDispatch();
  const service = useMemo(() => new Service(), []);
  const navigate = useNavigate();
  const location = useLocation();

  const editData = location.state?.edit ? location.state.researchData : null;
  const isEdit = !!editData;

  const [validationErrors, setValidationErrors] = useState({
    title: "",
    dept: "",
    year: "",
    duration: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    status: null,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bodyInitialState = {
    _id: "",
    __v: "",
    title: "",
    pi: "",
    co_pi: "",
    dept: [],
    amount: "",
    scheme: "",
    year: "",
    duration: "",
  };

  const bodyReducer = (state, action) => {
    switch (action.type) {
      case "SET_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };
      case "SET_MULTIPLE":
        return {
          ...state,
          ...action.payload,
        };
      case "RESET":
        return bodyInitialState;
      default:
        return state;
    }
  };

  const [body, dispatchBody] = useReducer(bodyReducer, null, () => {
    if (!editData) return bodyInitialState;

    const normalizedDept = Array.isArray(editData.dept)
      ? editData.dept
      : typeof editData.dept === "string"
        ? editData.dept
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    return {
      _id: editData._id,
      __v: editData.__v,
      title: editData.title || "",
      pi: editData.pi || "",
      co_pi: editData.co_pi || "",
      dept: normalizedDept,
      amount: editData.amount || "",
      scheme: editData.scheme || "",
      year: editData.year || "",
      duration: editData.duration || "",
    };
  });

  const [cjb, setCjb] = useState(() => {
    if (!editData) return [];
    if (Array.isArray(editData.dept)) return editData.dept;
    if (typeof editData.dept === "string") {
      return editData.dept
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  });
  const [selectedYear, setSelectedYear] = useState(() => editData?.year || "");
  const [duration, setDuration] = useState(() => editData?.duration || "");
  const [titles, setTitles] = useState([]);
  const [originalTitle] = useState(() =>
    editData?.title ? editData.title.replace(/\s+/g, " ").trim() : "",
  );

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarConfig((prev) => ({ ...prev, open: false }));
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSubmission = () => {
    setConfirmOpen(false);
    setIsSubmitting(true);

    const endpoint = isEdit ? "api/research/update" : "api/research/data";

    service
      .post(endpoint, body)
      .then(() => {
        setSnackbarConfig({
          open: true,
          status: 200,
          message: isEdit
            ? `Updated ${body.title} research project.`
            : `Succesfully Added ${body.title}`,
        });
        navigate("/research");
      })
      .catch((error) => {
        console.log(error);
        setSnackbarConfig({
          open: true,
          status: 500,
          message: isEdit
            ? `Error while updating ${body.title}. Please Try again later.`
            : `Error while adding ${body.title}. Please Try again later.`,
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const runValidation = () => {
    const errors = {
      title: "",
      dept: "",
      year: "",
      duration: "",
    };

    const sanitizedTitle = (body.title || "").replace(/\s+/g, " ").trim();
    const isSameAsOriginal =
      isEdit &&
      originalTitle &&
      sanitizedTitle.toLowerCase() === originalTitle.toLowerCase();

    if (
      sanitizedTitle &&
      !isSameAsOriginal &&
      containsIgnoreCase(titles, sanitizedTitle)
    ) {
      errors.title = "Title Already exists";
    }
    if (cjb.length === 0) {
      errors.dept = "Please select a value.";
    }
    if (!selectedYear) {
      errors.year = "Please select a value.";
    }
    if (!duration) {
      errors.duration = "Please enter duration.";
    }

    setValidationErrors(errors);
    return !errors.title && !errors.dept && !errors.year && !errors.duration;
  };

  const handleFieldChange = (field, value) => {
    let updatedValue = value;

    if (field === "title") {
      updatedValue = (updatedValue || "").replace(/\s+/g, " ");
      const sanitized = updatedValue.trim();
      const isSameAsOriginal =
        isEdit &&
        originalTitle &&
        sanitized.toLowerCase() === originalTitle.toLowerCase();
      const duplicateTitle =
        sanitized && !isSameAsOriginal && containsIgnoreCase(titles, sanitized);
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

    if (field === "year") {
      setSelectedYear(updatedValue);
      setValidationErrors((prev) => ({
        ...prev,
        year: updatedValue ? "" : "Please select a value.",
      }));
    }

    if (field === "duration") {
      setDuration(updatedValue);
      setValidationErrors((prev) => ({
        ...prev,
        duration: updatedValue ? "" : "Please enter duration.",
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

  useEffect(() => {
    dispatch(Tab("new-research"));
    if (!loggedIn) {
      navigate("../");
    } else if (!verify) {
      navigate("../verify");
    } else if (isSuperAdmin) {
      navigate("../research");
    }

    if (titles.length === 0) {
      service
        .get("api/research/titles")
        .then((res) => {
          setTitles(res || []);
        })
        .catch((error) => {
          console.log("ERROR", error);
        });
    }
  }, [
    dispatch,
    isSuperAdmin,
    loggedIn,
    navigate,
    service,
    titles.length,
    verify,
  ]);

  return (
    <>
      <div
        style={{
          height: "88vh",
          width: "100wh",
          backgroundColor: "#c5d299",
          paddingBottom: "150px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Card sx={{ borderRadius: "15px" }}>
            <CardContent sx={{ p: "0px !important" }}>
              <form id="insert-data" onSubmit={onSubmit}>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ p: { xs: 2, md: 5 }, bgcolor: white }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ color: "#6C9449", fontWeight: 500 }}
                    >
                      Research Project Information
                    </Typography>

                    <TextField
                      label={ResearchKey.title}
                      placeholder={ResearchKey.title}
                      id="title"
                      required
                      fullWidth
                      margin="normal"
                      value={body.title}
                      onChange={(event) =>
                        handleFieldChange("title", event.target.value)
                      }
                      error={!!validationErrors.title}
                      helperText={validationErrors.title}
                    />

                    <TextField
                      label={
                        ResearchKey.pi +
                        '  (Add multiple authors seperated by ",")'
                      }
                      id="authors"
                      placeholder={ResearchKey.pi}
                      required
                      fullWidth
                      margin="normal"
                      value={body.pi}
                      onChange={(event) =>
                        handleFieldChange("pi", event.target.value)
                      }
                    />

                    <TextField
                      label={
                        ResearchKey.co_pi +
                        '  (Add multiple authors seperated by ",")'
                      }
                      id="co_authors"
                      placeholder={ResearchKey.co_pi}
                      required
                      fullWidth
                      margin="normal"
                      value={body.co_pi}
                      onChange={(event) =>
                        handleFieldChange("co_pi", event.target.value)
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ p: { xs: 2, md: 5 }, bgcolor: primaryColor }}
                  >
                    <Grid container spacing={2} sx={{ mt: { xs: 0, md: 4 } }}>
                      <Grid item xs={12} md={6}>
                        <FormControl
                          fullWidth
                          required
                          error={!!validationErrors.year}
                        >
                          <InputLabel id="year-label">
                            {ResearchKey.year}
                          </InputLabel>
                          <MUISelect
                            labelId="year-label"
                            id="year"
                            label={ResearchKey.year}
                            value={selectedYear}
                            onChange={(event) =>
                              handleFieldChange("year", event.target.value)
                            }
                          >
                            {years.map((year) => (
                              <MenuItem key={year} value={year}>
                                {year}
                              </MenuItem>
                            ))}
                          </MUISelect>
                          {validationErrors.year && (
                            <FormHelperText>
                              {validationErrors.year}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label={ResearchKey.duration}
                          placeholder="Enter Duration"
                          id="duration"
                          required
                          fullWidth
                          margin="normal"
                          type="number"
                          value={duration}
                          onChange={(event) =>
                            handleFieldChange("duration", event.target.value)
                          }
                          error={!!validationErrors.duration}
                          helperText={validationErrors.duration}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Autocomplete
                          multiple
                          disableCloseOnSelect
                          options={Departments}
                          value={cjb}
                          onChange={(_, value) =>
                            handleFieldChange("dept", value)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={ResearchKey.dept}
                              placeholder={
                                cjb.length === 0
                                  ? "Select At least One"
                                  : "Type to search"
                              }
                              error={!!validationErrors.dept}
                              helperText={validationErrors.dept}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label={ResearchKey.amount}
                          placeholder="Enter Amount"
                          id="amount"
                          required
                          fullWidth
                          margin="normal"
                          value={body.amount}
                          onChange={(event) =>
                            handleFieldChange("amount", event.target.value)
                          }
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      label={ResearchKey.scheme}
                      placeholder="Enter Scheme"
                      id="scheme"
                      required
                      fullWidth
                      margin="normal"
                      value={body.scheme}
                      onChange={(event) =>
                        handleFieldChange("scheme", event.target.value)
                      }
                    />
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      justifyContent={"center"}
                      mt={2}
                    >
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          display: "flex",
                          justifyContent: {
                            md: "flex-start",
                            xs: "center",
                          },
                        }}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          type="submit"
                          form="insert-data"
                          disabled={isSubmitting}
                          sx={{ mt: 2, mr: { xs: 0, md: 2 } }}
                        >
                          {isEdit ? "Update" : "Submit"}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          display: "flex",
                          justifyContent: {
                            md: "flex-end",
                            xs: "center",
                          },
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            mt: 2,
                            color: "#ffffff",
                            borderColor: "#ffffff",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#ffffff",
                              color: "#6C9449",
                              borderColor: "#ffffff",
                            },
                          }}
                          onClick={() => navigate("/research")}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
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

export default NewResearch;
