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
import { useNavigate, useLocation } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Zoom } from "@mui/material";
import Service from "../../Service/http";
import { useDispatch, useSelector } from "react-redux";
import { BulkUpload } from "./BulkUpload";
import { Tab } from "../../store/Actions";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import { IconEdit } from "@tabler/icons-react";
import _ from 'lodash';
import {
  authorPositionOptions,
  branchOptions,
  cjbOptions,
  nationalityOptions,
} from "../../utils/helper";
import { primary, primaryColor, primaryHover, white } from "../../utils/colors";
import { getMonthLabel, MONTH_OPTIONS } from "../../utils/constants";
import { PublicationsKey } from "../../Service/keyValueMap";

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
  userId: ''
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      const edit = action.value;
      // Normalize author_no from backend to a comma-separated string
      const normalizedAuthorNo = Array.isArray(edit.author_no)
        ? edit.author_no.join(",")
        : edit.author_no || "";

      const presentYear = edit.year ? new Date(edit.year).getFullYear() : "";
      return {
        ...state,
        body: {
          ...edit,
          author_no: normalizedAuthorNo,
        },
        yearvalue: presentYear,
        monthvalue: edit.month,
        cjb: edit.cjb,
        branch: edit.branch,
        nationality: edit.nationality,
        is_proceedings: edit.is_proceeding || edit.is_proceedings,
        is_published: edit.is_published,
        is_affilated: edit.is_affilated,
        author_no: normalizedAuthorNo,
      };
    }
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
      const year = action.value; // numeric or string year from <Select>
      // Build a canonical date using selected month if available, else January
      const month =
        state.body.month && String(state.body.month).length > 0
          ? state.body.month
          : "01";
      const computedYear =
        year !== ""
          ? new Date(
              `${year}-${String(month).padStart(2, "0")}-01`
            ).toLocaleDateString()
          : "";
      return {
        ...state,
        yearvalue: year,
        body: {
          ...state.body,
          year: computedYear,
        },
      };
    }
    case "SET_MONTH": {
      const { value } = action;
      const month = String(value || "01").padStart(2, "0");
      const computedYear =
        state.yearvalue !== ""
          ? new Date(
              `${state.yearvalue}-${month}-01`
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
                "-01"
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

function Publication() {
  const loggedIn = useSelector((state) => state.logged);
  const verify = useSelector((state) => state.verify);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);
  const isAdmin = useSelector((state) => state.isAdmin);
  const username = useSelector((state) => state.Name);
  const service = React.useMemo(() => new Service(), []);
  const profileId = useSelector((state) => state.profileId);
  const yearpre = new Date();
  const dispatch = useDispatch();
  const formRef = React.useRef();
  const [month] = useState(MONTH_OPTIONS);

  
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = !!location.state?.edit;
  const editData = location.state?.publicationData || null;

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

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    status: 0,
    message: "",
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [file, setFile] = useState(null);

  // Initialize edit state when editing
  useEffect(() => {
    if (isEditMode && editData) {
      dispatchReducer({ type: "INIT", value: editData });
      // If backend returns stored file info, you may want to set some placeholder:
      // setFile({ name: editData.fileName || "" }); // optional, depending on your FileUploadSection
    }
  }, [isEditMode, editData]);

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

    const payload = {
      ...body,
      userId: profileId,
    }

    // console.log("payload", payload)
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
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
    const isMultipart = !!file;
    const baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
    const requestURL = isEditMode
      ? `${baseURL}/api/publications/data/${editData._id || editData.id}`
      : `${baseURL}/api/publications/data`;
    const requestType = isEditMode ? "PUT" : "POST";

    // Build fetch options based on payload type
    const requestOptions = {
      method: requestType,
      ...(isMultipart
        ? { body: formData } // Let browser set multipart boundary
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
    };

    const request = fetch(requestURL, requestOptions)

    request
      .then(() => {
        showSnackbar(
          200,
          `${isEditMode ? "Successfully Updated" : "Successfully Added"} ${
            body.title
          }`
        );
        setTimeout(() => {
          navigate("/publications");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        showSnackbar(
          500,
          `Error ${isEditMode ? "updating" : "adding"} publication`
        );
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
    if (key === "author_no") {
      // Handle multi-select dropdown for author_no
      const selectedValues = typeof value === "string" ? value.split(",") : value;
      const concatenatedValue = selectedValues.join(","); // Concatenate selected values
      dispatchReducer({
        type: "SET_FIELD",
        field: "author_no",
        value: concatenatedValue,
        stateKey: "author_no",
      });
    } else
    if (config.type === "SET_YEAR") {
      dispatchReducer({ type: "SET_YEAR", value: inputValue });
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
      { value: body.title, id: "publication", name: PublicationsKey.title },
      { value: body.username, id: "authors", name: PublicationsKey.username },
      { value: cjb, id: "cjb", name: PublicationsKey.cjb },
      { value: branch, id: "branch", name: PublicationsKey.branch },
      {
        value: nationality,
        id: "nationality",
        name: PublicationsKey.nationality,
      },
      {
        value: body.name_cjb,
        id: "name_c-j-b",
        name: PublicationsKey.name_cjb,
      },
      { value: body.doi, id: "issn", name: PublicationsKey.doi },
      { value: body.cite, id: "article-cite", name: PublicationsKey.cite },
      { value: body.link, id: "link", name: PublicationsKey.link },
      { value: yearvalue, id: "year", name: PublicationsKey.year },
      { value: monthvalue, id: "month", name: PublicationsKey.month },
      { value: body.scl, id: "scopus", name: PublicationsKey.scl },
      ...(isEditMode ? [] : [{ value: file, id: "file", name: "File Upload" }]),
    ];

    const newErrors = {};
    const missingFields = [];
    mandatoryFields.forEach((field) => {
      if (!field.value && field.value !== 0) {
        newErrors[field.id] = true;
        missingFields.push(field.name);
      }
    });

    setErrors(newErrors);

    if (missingFields.length > 0) {
      showSnackbar(
        400,
        `Missing mandatory fields: ${missingFields.join(", ")}`
      );
    } else if (!isEditMode && titles.includes(body.title)) {
      showSnackbar(409, "Duplicate Title");
    } else {
      setConfirmDialogOpen(true);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (errors.file) setErrors({ ...errors, file: false });
  };

  useEffect(() => {
    dispatch(Tab(isEditMode ? "edit-publication" : "new-publication"));
    if (!loggedIn) {
      navigate("../");
    } else if (!verify) {
      navigate("../verify");
    } else if (isSuperAdmin && !isEditMode) {
      // Keep behavior from new, but allow super admin to open edit page if needed
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
    isEditMode,
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
              {isAdmin && !isEditMode ? (
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
                          {isEditMode
                            ? "Edit Publication Information"
                            : "Publication Information"}
                        </Typography>
                        {/* All TextFields/Selects now get their values from state.body / state.* to show edit data */}
                        <TextField
                          required
                          id="publication"
                          name="publication"
                          label={PublicationsKey.title}
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors.publication}
                          value={body.title || ""}
                        />
                        <TextField
                          required
                          id="authors"
                          name="authors"
                          label={
                            PublicationsKey.username +
                            ' (Add multiple authors seperated by ",")'
                          }
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors.authors}
                          value={body.username || ""}
                        />
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={4}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.cjb}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {PublicationsKey.cjb + "*"}
                              </InputLabel>
                              <Select
                                labelId="cjb"
                                id="cjb"
                                name="cjb"
                                value={cjb}
                                onChange={handleFieldChange}
                                label={PublicationsKey.cjb}
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
                                {PublicationsKey.branch + "*"}
                              </InputLabel>
                              <Select
                                labelId="branch"
                                id="branch"
                                name="branch"
                                value={branch}
                                onChange={handleFieldChange}
                                label={PublicationsKey.branch}
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
                                {PublicationsKey.nationality + "*"}
                              </InputLabel>
                              <Select
                                labelId="nationality"
                                id="nationality"
                                name="nationality"
                                value={nationality}
                                onChange={handleFieldChange}
                                label={PublicationsKey.nationality}
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
                          label={PublicationsKey.name_cjb}
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors["name_c-j-b"]}
                          value={body.name_cjb || ""}
                        />
                        <TextField
                          required
                          id="issn"
                          name="issn"
                          label={PublicationsKey.doi}
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors.issn}
                          value={body.doi || ""}
                        />
                        <TextField
                          required
                          id="article-cite"
                          name="article-cite"
                          label={PublicationsKey.cite}
                          fullWidth
                          variant="standard"
                          onChange={handleFieldChange}
                          error={!!errors["article-cite"]}
                          value={body.cite || ""}
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
                          label={PublicationsKey.organised_by}
                          fullWidth
                          variant="standard"
                          color="secondary"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          value={body.organised_by || ""}
                        />
                        <TextField
                          required
                          id="link"
                          name="link"
                          label={PublicationsKey.link}
                          fullWidth
                          variant="standard"
                          color="secondary"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          error={!!errors.link}
                          value={body.link || ""}
                        />
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              id="vol"
                              name="vol"
                              label={PublicationsKey.vol}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleFieldChange}
                              value={body.vol || ""}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              id="issue"
                              name="issue"
                              label={PublicationsKey.issue}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="number"
                              onChange={handleFieldChange}
                              value={body.issue || ""}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.year}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {PublicationsKey.year + "*"}
                              </InputLabel>
                              <Select
                                labelId="year"
                                id="year"
                                name="year"
                                value={yearvalue}
                                onChange={handleFieldChange}
                                label={PublicationsKey.year}
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
                                {PublicationsKey.month + "*"}
                              </InputLabel>
                              <Select
                                labelId="month"
                                id="month"
                                name="month"
                                value={monthvalue}
                                onChange={handleFieldChange}
                                label={getMonthLabel(monthvalue)}
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
                                label={PublicationsKey.is_proceeding}
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
                                label={PublicationsKey.is_published}
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
                                label={PublicationsKey.is_affilated}
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
                                {PublicationsKey.author_no}
                              </InputLabel>
                              <Select
                                labelId="author_no"
                                id="author_no"
                                name="author_no"
                                // Safely derive array value for multiple select
                                value={
                                  typeof author_no === "string" && author_no.length > 0
                                    ? author_no.split(",")
                                    : []
                                }
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
                              value={body.starting_page || ""}
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
                              value={body.ending_page || ""}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              required
                              id="scopus"
                              name="scopus"
                              label={PublicationsKey.scl}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleFieldChange}
                              error={!!errors.scopus}
                              value={body.scl || ""}
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <TextField
                              id="citationscopus"
                              name="citationscopus"
                              label={PublicationsKey.citation_scopus}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleFieldChange}
                              value={body.citation_scopus || ""}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              id="citationgoogle"
                              name="citationgoogle"
                              label={PublicationsKey.citation_google}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleFieldChange}
                              value={body.citation_google || ""}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <FileUploadSection
                            file={file}
                            handleFileChange={handleFileChange}
                            error={!!errors.file}
                            onError={handleUploadError}
                          />
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          alignItems="center"
                          justifyContent={"center"}
                          sx={{ mt: { xs: 2, md: 0 } }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                              display: "flex",
                              justifyContent: { md: "flex-end", xs: "center" },
                            }}
                          >
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
                                width: "auto",
                              }}
                              onClick={() => {
                                formRef.current.reportValidity();
                                setSend(send + 1);
                              }}
                            >
                              {isEditMode ? "Update" : "Submit"}
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
                                color: white,
                                borderColor: white,
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: white,
                                  color: primaryColor,
                                  borderColor: white,
                                },
                              }}
                              onClick={() => navigate("/publications")}
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
          title={isEditMode ? "Confirm Update" : "Confirm Submission"}
          content={
            isEditMode
              ? "This action will update the data in the Database"
              : "This action will add the data into the Database"
          }
        />
      </div>
    </>
  );
}

export default Publication;
