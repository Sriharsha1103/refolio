import React, { useEffect, useState, useReducer } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Button, Typography } from "@mui/material";
import Service from "../../Service/http";
import { Publication } from "../../Service/keyValueMap";
import { useDispatch, useSelector } from "react-redux";
import { BulkUpload } from "./BulkUpload";
import { Tab } from "../../store/Actions";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import {
  authorPositionOptions,
  branchOptions,
  cjbOptions,
  nationalityOptions,
} from "../../utils/helper";
import { primary, primaryColor, primaryHover, white } from "../../utils/colors";
import { getMonthLabel, MONTH_OPTIONS } from "../../utils/constants";

// Unified Form Configuration
const FORM_CONFIG = {
  // Simple body fields
  publication: { bodyField: "title" },
  authors: { bodyField: "username" },
  "name_c-j-b": { bodyField: "name_cjb" },
  vol: { bodyField: "vol" },
  issue: { bodyField: "issue" },
  issn: { bodyField: "doi" },
  organizer: { bodyField: "organised_by" },
  organizor: { bodyField: "organised_by" },
  scopus: { bodyField: "scl" },
  citationscopus: { bodyField: "citation_scopus" },
  citationgoogle: { bodyField: "citation_google" },
  link: { bodyField: "link" },
  startingPage: { bodyField: "starting_page" },
  endingPage: { bodyField: "ending_page" },
  "article-cite": { bodyField: "cite" },

  // Fields updating both root state and body (SET_FIELD)
  cjb: { type: "SET_FIELD", field: "cjb", stateKey: "cjb" },
  branch: { type: "SET_FIELD", field: "branch", stateKey: "branch" },
  nationality: {
    type: "SET_FIELD",
    field: "nationality",
    stateKey: "nationality",
  },
  proceedings: {
    type: "SET_FIELD",
    field: "is_proceeding",
    stateKey: "is_proceedings",
  },
  published: {
    type: "SET_FIELD",
    field: "is_published",
    stateKey: "is_published",
  },
  affiliated: {
    type: "SET_FIELD",
    field: "is_affilated",
    stateKey: "is_affilated",
  },
  author_no: { type: "SET_FIELD", field: "author_no", stateKey: "author_no" },

  // Special handlers
  year: { type: "SET_YEAR" },
  month: { type: "SET_MONTH" },
};

const initialState = {
  body: {
    username: "",
    cjb: "",
    branch: "",
    nationality: "",
    is_proceeding: false,
    is_affilated: false,
    is_published: false,
    author_no: [],
    title: "",
    name_cjb: "",
    vol: "",
    issue: "",
    year: "",
    month: "",
    doi: "",
    organised_by: "",
    scl: "",
    citation_scopus: "",
    citation_google: "",
    link: "",
    starting_page: 0,
    ending_page: 0,
    cite: "",
  },
  yearvalue: "",
  monthvalue: "",
  cjb: "",
  branch: "",
  nationality: "",
  is_proceedings: false,
  is_published: false,
  is_affilated: false,
  author_no: [],
  date: "",
  yearInput: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        body: { ...state.body, [action.field]: action.value },
        [action.stateKey]: action.value,
      };
    case "SET_BODY_FIELD":
      return {
        ...state,
        body: { ...state.body, [action.field]: action.value },
      };
    case "SET_YEAR": {
      const { value } = action;
      const computedYear = new Date(
        value +
          "-" +
          (state.body.month === "" ? "01" : state.body.month) +
          "-01",
      ).toLocaleDateString();
      return {
        ...state,
        yearvalue: value,
        body: { ...state.body, year: computedYear },
      };
    }
    case "SET_MONTH": {
      const { value } = action;
      const computedYear =
        state.yearvalue !== ""
          ? new Date(
              state.yearvalue +
                "-" +
                (value.length === 1
                  ? "0" + value
                  : value.length === 0
                    ? "01"
                    : value) +
                "-01",
            ).toLocaleDateString()
          : state.body.year;
      return {
        ...state,
        monthvalue: value,
        body: { ...state.body, month: value, year: computedYear },
      };
    }
    case "SET_DATE_INPUT": {
      const { value, rawDate } = action;
      const computedYear =
        2000 < value && value < 2100
          ? new Date(
              value +
                "-" +
                (state.body.month === "" ? "01" : state.body.month) +
                "-01",
            ).toLocaleDateString()
          : "";
      return {
        ...state,
        date: rawDate,
        yearInput: value,
        body: { ...state.body, year: computedYear },
      };
    }
    case "SET_DATE_PICKER":
      return {
        ...state,
        date: action.value,
        body: {
          ...state.body,
          year: new Date(action.value).toLocaleDateString(),
        },
      };
    default:
      return state;
  }
}

function AddPublications() {
  const loggedIn = useSelector((state) => state.logged);
  const verify = useSelector((state) => state.verify);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);
  const isAdmin = useSelector((state) => state.isAdmin);
  const username = useSelector((state) => state.Name);
  const service = React.useMemo(() => new Service(), []);
  const yearpre = new Date();
  const dispatch = useDispatch();
  const formRef = React.useRef();
  const [month] = useState(MONTH_OPTIONS);

  const [state, dispatchReducer] = useReducer(reducer, initialState);
  const {
    body,
    yearvalue,
    monthvalue,
    cjb,
    branch,
    nationality,
    is_proceedings,
    is_published,
    is_affilated,
    author_no,
  } = state;

  const years = ["None"];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }

  const [titles, setTitles] = useState([]);
  const [send, setSend] = useState(0);
  const navigate = useNavigate();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    status: 0,
    message: "",
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    showSnackbar(400, "Cancelled the insert action.");
  };

  const handleConfirmSubmit = () => {
    setConfirmDialogOpen(false);
    const formData = new FormData();
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });
    if (file) {
      const timestamp = new Date();
      const fileName = file.name.split(".")[0].substring(0, 10);
      const newFileName = `${username}_${fileName}_${timestamp.getDate()}-${
        timestamp.getMonth() + 1
      }-${timestamp.getFullYear()}.${file.name.split(".").pop()}`;
      formData.append("file", file, newFileName);
      formData.append("fileName", newFileName);
    }
    const payload = file ? formData : body;
    fetch("http://localhost:8001/api/publications/data", {
      method: "POST",
      body: payload,
    })
      .then((json) => {
        showSnackbar(200, "Successfully Added " + body.title);
        setTimeout(() => {
          navigate("/publications");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        showSnackbar(500, "Error adding publication");
      });
  };

  const showSnackbar = (status, message) => {
    setSnackbar({ open: true, status, message });
  };

  const handleUploadError = (message) => {
    showSnackbar(400, message);
  };

  const handleFieldChange = (e) => {
    // Handle specific Date Picker case if it returns raw event or object
    if (!e.target) {
      dispatchReducer({ type: "SET_DATE_PICKER", value: e });
      return;
    }

    const { name, value, id, type, checked } = e.target;
    // Use name as primary key, fallback to id
    const key = name || id;

    // Normalize value for checkboxes vs other inputs
    const inputValue = type === "checkbox" ? !!checked : value;

    // Clear errors
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }

    const config = FORM_CONFIG[key];

    if (!config) {
      // Fallback or unmapped fields (e.g. raw date input)
      dispatchReducer({ type: "SET_DATE_INPUT", value: value, rawDate: e });
      return;
    }

    if (config.type === "SET_YEAR") {
      dispatchReducer({ type: config.type, value: inputValue });
    } else if (config.type === "SET_MONTH") {
      let monthValue = inputValue;
      dispatchReducer({ type: config.type, value: monthValue });
    } else if (config.type === "SET_FIELD") {
      dispatchReducer({
        type: "SET_FIELD",
        field: config.field,
        value: inputValue,
        stateKey: config.stateKey,
      });
    } else if (config.bodyField) {
      dispatchReducer({
        type: "SET_BODY_FIELD",
        field: config.bodyField,
        value: inputValue,
      });
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const mandatoryFields = [
      { value: body.title, id: "publication", name: Publication.title },
      { value: body.username, id: "authors", name: Publication.username },
      { value: cjb, id: "cjb", name: Publication.cjb },
      { value: branch, id: "branch", name: Publication.branch },
      { value: nationality, id: "nationality", name: Publication.nationality },
      { value: body.name_cjb, id: "name_c-j-b", name: Publication.name_cjb },
      { value: body.doi, id: "issn", name: Publication.doi },
      { value: body.cite, id: "article-cite", name: Publication.cite },
      { value: body.link, id: "link", name: Publication.link },
      { value: yearvalue, id: "year", name: Publication.year },
      { value: monthvalue, id: "month", name: Publication.month },
      { value: body.scl, id: "scopus", name: Publication.scl },
      { value: file, id: "file", name: "File Upload" },
    ];

    const newErrors = {};
    const missingFields = [];
    mandatoryFields.forEach((field) => {
      if (!field.value) {
        newErrors[field.id] = true;
        missingFields.push(field.name);
      }
    });

    setErrors(newErrors);

    if (missingFields.length > 0) {
      showSnackbar(
        400,
        `Missing mandatory fields: ${missingFields.join(", ")}`,
      );
    } else if (titles.includes(body.title)) {
      showSnackbar(409, "Duplicate Title");
    } else {
      setConfirmDialogOpen(true);
    }
  };

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (errors.file) setErrors({ ...errors, file: false });
  };

  useEffect(() => {
    dispatch(Tab("new-publication"));
    if (!loggedIn) {
      navigate("../");
    } else if (!verify) {
      navigate("../verify");
    } else if (isSuperAdmin) {
      navigate("../publications");
    }
    if (titles.length === 0) {
      service
        .get("api/publications/titles")
        .then((res) => {
          setTitles(res);
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
          height: "fill",
          width: "100wh",
          backgroundColor: "#c5d299",
          paddingBottom: "150px",
        }}
      >
        <Container maxWidth={false}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} sx={{ m: 4 }}>
              {isAdmin ? (
                <Grid container justifyContent="flex-end" sx={{ mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <BulkUpload titles={titles} />
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
              <Card sx={{ borderRadius: "15px" }}>
                <CardContent sx={{ p: "0px !important" }}>
                  <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ p: { xs: 2, md: 5 }, bgcolor: white }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ mb: 4, color: primaryColor }}
                        >
                          Publication Information
                        </Typography>
                        <TextField
                          required
                          id="publication"
                          name="publication"
                          label={Publication.title}
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors.publication}
                        />
                        <TextField
                          required
                          id="authors"
                          name="authors"
                          label={
                            Publication.username +
                            ' (Add multiple authors seperated by ",")'
                          }
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors.authors}
                        />
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={4}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.cjb}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.cjb + "*"}
                              </InputLabel>
                              <Select
                                labelId="cjb"
                                id="cjb"
                                name="cjb"
                                value={cjb}
                                onChange={handleFieldChange}
                                label={Publication.cjb}
                                required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {cjbOptions.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.branch}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.branch + "*"}
                              </InputLabel>
                              <Select
                                labelId="branch"
                                id="branch"
                                name="branch"
                                value={branch}
                                onChange={handleFieldChange}
                                label={Publication.branch}
                                required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {branchOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.nationality}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.nationality + "*"}
                              </InputLabel>
                              <Select
                                labelId="nationality"
                                id="nationality"
                                name="nationality"
                                value={nationality}
                                onChange={handleFieldChange}
                                label={Publication.nationality}
                                required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {nationalityOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <TextField
                          required
                          id="name_c-j-b"
                          name="name_c-j-b"
                          label={Publication.name_cjb}
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors["name_c-j-b"]}
                        />
                        <TextField
                          required
                          id="issn"
                          name="issn"
                          label={Publication.doi}
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors.issn}
                        />
                        <TextField
                          required
                          id="article-cite"
                          name="article-cite"
                          label={Publication.cite}
                          fullWidth
                          variant="standard"
                          onChange={handleFieldChange}
                          error={!!errors["article-cite"]}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ p: { xs: 2, md: 5 }, bgcolor: primaryColor }}
                      >
                        <TextField
                          id="organizer"
                          name="organizer"
                          label={Publication.organised_by}
                          fullWidth
                          variant="standard"
                          color="secondary"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                        />
                        <TextField
                          required
                          id="link"
                          name="link"
                          label={Publication.link}
                          fullWidth
                          variant="standard"
                          color="secondary"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors.link}
                        />
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              id="vol"
                              name="vol"
                              label={Publication.vol}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleFieldChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              id="issue"
                              name="issue"
                              label={Publication.issue}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleFieldChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.year}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.year + "*"}
                              </InputLabel>
                              <Select
                                labelId="year"
                                id="year"
                                name="year"
                                value={yearvalue}
                                onChange={handleFieldChange}
                                label={Publication.year}
                                required
                              >
                                {years.map((item) => (
                                  <MenuItem
                                    key={item}
                                    value={item === "None" ? "" : item}
                                  >
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.month}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {Publication.month + "*"}
                              </InputLabel>
                              <Select
                                labelId="month"
                                id="month"
                                name="month"
                                value={monthvalue}
                                onChange={handleFieldChange}
                                label={ getMonthLabel(monthvalue)}
                                required
                                
                              >
                                {MONTH_OPTIONS.map((item) => (
                                  <MenuItem
                                    key={item.value}
                                    value={item === "None" ? "" : item.value}
                                  >
                                    {item.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={4}>
                            <FormControl sx={{ minWidth: 120, width: "100%" }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    id="proceedings"
                                    name="proceedings"
                                    color="secondary"
                                    checked={!!is_proceedings}
                                    onChange={handleFieldChange}
                                  />
                                }
                                label={Publication.is_proceeding}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <FormControl sx={{ minWidth: 120, width: "100%" }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    id="published"
                                    name="published"
                                    color="secondary"
                                    checked={!!is_published}
                                    onChange={handleFieldChange}
                                  />
                                }
                                label={Publication.is_published}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FormControl sx={{ minWidth: 120, width: "100%" }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    id="affiliated"
                                    name="affiliated"
                                    color="secondary"
                                    checked={!!is_affilated}
                                    onChange={handleFieldChange}
                                  />
                                }
                                label={Publication.is_affilated}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={4}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                color="secondary"
                              >
                                {Publication.author_no}
                              </InputLabel>
                              <Select
                                labelId="author_no"
                                id="author_no"
                                name="author_no"
                                value={author_no}
                                onChange={handleFieldChange}
                                label="Author Order"
                                color="secondary"
                                multiple
                              >
                                <MenuItem value={""}>
                                  <em>None</em>
                                </MenuItem>
                                {authorPositionOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              id="startingPage"
                              name="startingPage"
                              label="Starting Page"
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleFieldChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              id="endingPage"
                              name="endingPage"
                              label="Ending Page"
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleFieldChange}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              required
                              id="scopus"
                              name="scopus"
                              label={Publication.scl}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleFieldChange}
                              error={!!errors.scopus}
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              id="citationscopus"
                              name="citationscopus"
                              label={Publication.citation_scopus}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleFieldChange}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              id="citationgoogle"
                              name="citationgoogle"
                              label={Publication.citation_google}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleFieldChange}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          alignItems="center"
                          sx={{ mt: { xs: 2, md: 0 } }}
                        >
                          <Grid item xs={12} md={8}>
                            <FileUploadSection
                              file={file}
                              handleFileChange={handleFileChange}
                              error={!!errors.file}
                              onError={handleUploadError}
                            />
                          </Grid>
                          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { md: 'flex-end', xs: 'center' } }}>
                            <Button
                              variant="contained"
                              type="submit"
                              form="insert-data"
                              sx={{
                                mt: { xs: 2, md: 0 },
                                backgroundColor: primary,
                                color: primaryColor,
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: primaryHover,
                                  color: white,
                                },
                                width: 'auto',
                                
                              }}
                              onClick={() => {
                                formRef.current.reportValidity();
                                setSend(send + 1);
                              }}
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
        <CustomSnackbar
          open={snackbar.open}
          handleClose={handleCloseSnackbar}
          status={snackbar.status}
          message={snackbar.message}
        />
        <CustomConfirmDialog
          open={confirmDialogOpen}
          handleClose={handleCloseConfirmDialog}
          handleConfirm={handleConfirmSubmit}
          title="Confirm Submission"
          content="This action will add the data into the Database"
        />
      </div>
    </>
  );
}

export default AddPublications;
