import React, { useEffect, useState, useReducer } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../RNavbar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";
import Service from "../../Service/http";
import { Publication } from "../../Service/keyValueMap";
import { useDispatch, useSelector } from "react-redux";
import { BulkUpload } from "./BulkUpload";
import { Tab } from "../../store/Actions";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import { authorPositionOptions, binaryOptions, branchOptions, cjbOptions, nationalityOptions } from "../../utils/helper";

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
  nationality: { type: "SET_FIELD", field: "nationality", stateKey: "nationality" },
  proceedings: { type: "SET_FIELD", field: "is_proceeding", stateKey: "is_proceedings" },
  published: { type: "SET_FIELD", field: "is_published", stateKey: "is_published" },
  affiliated: { type: "SET_FIELD", field: "is_affilated", stateKey: "is_affilated" },
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
    is_proceeding: "",
    is_affilated: "",
    is_published: "",
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
  is_proceedings: "",
  is_published: "",
  is_affilated: "",
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
          "-01"
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
                "-01"
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

function FirstData() {
  const loggedIn = useSelector((state) => state.logged);
  const verify = useSelector((state) => state.verify);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);
  const isAdmin = useSelector((state) => state.isAdmin);
  const username = useSelector((state) => state.Name);
  const service = new Service();
  const yearpre = new Date();
  const dispatch = useDispatch();
  const here = new Date(
    "Sun Jan 01 2023 00:00:00 GMT+0530 (India Standard Time)"
  ).toLocaleDateString();
  const formRef = React.useRef();
  const [month, setMonth] = useState([
    "None",
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
  ]);

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
    date,
    yearInput,
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

    const { name, value, id } = e.target;
    // Use name as primary key, fallback to id
    const key = name || id;

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

    if (config.type === "SET_YEAR" || config.type === "SET_MONTH") {
        dispatchReducer({ type: config.type, value });
    } else if (config.type === "SET_FIELD") {
        dispatchReducer({ 
            type: "SET_FIELD", 
            field: config.field, 
            value, 
            stateKey: config.stateKey 
        });
    } else if (config.bodyField) {
        dispatchReducer({ 
            type: "SET_BODY_FIELD", 
            field: config.bodyField, 
            value 
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
      showSnackbar(400, `Missing mandatory fields: ${missingFields.join(", ")}`);
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
    if (titles.length == 0) {
      service
        .get("api/publications/titles")
        .then((res) => {
          setTitles(res);
        })
        .catch((error) => {
          console.log("ERROR", error);
        });
    }
  }, []);
  return (
    <>
      {/* <HomeNavbar /> */}
      <div
        style={{
          height: "fill",
          width: "100wh",
          backgroundColor: "#c5d299",
          paddingBottom: "150px",
        }}
      >
        <MDBContainer fluid className="h-custom">
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol col="12" className="m-4">
              {isAdmin ? (
                <MDBRow end className="mb-4">
                  <MDBCol md="4">
                    <BulkUpload titles={titles} />
                  </MDBCol>
                </MDBRow>
              ) : (
                ""
              )}
              <MDBCard
                className="card-registration card-registration-2"
                style={{ borderRadius: "15px" }}
              >
                <MDBCardBody className="p-0">
                  <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                    <MDBRow>
                      <MDBCol md="6" className="p-5 bg-white">
                        <h3
                          className="fw-normal mb-5"
                          style={{ color: "#6C9449" }}
                        >
                          Publication Information
                        </h3>
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
                        <MDBRow className="mb-4">
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
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
                          </MDBCol>

                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
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
                          </MDBCol>
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
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
                          </MDBCol>
                        </MDBRow>

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
                      </MDBCol>

                      <MDBCol md="6" className="bg-indigo p-5">
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
                        <MDBRow className="mb-4">
                          <MDBCol md="3">
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
                          </MDBCol>
                          <MDBCol md="3">
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
                          </MDBCol>
                          <MDBCol md="3">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
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
                                  <MenuItem value={item === "None" ? "" : item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </MDBCol>
                          <MDBCol md="3">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
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
                                label="month"
                                required
                              >
                                {month.map((item) => (
                                  <MenuItem value={item === "None" ? "" : item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </MDBCol>
                        </MDBRow>

                        <MDBRow className="mb-4">
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                color="secondary"
                              >
                                {Publication.is_proceeding}
                              </InputLabel>
                              <Select
                                labelId="proceedings"
                                id="proceedings"
                                name="proceedings"
                                value={is_proceedings}
                                onChange={handleFieldChange}
                                label="In Proceedings?"
                                color="secondary"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {binaryOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </MDBCol>

                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                color="secondary"
                              >
                                {Publication.is_published}
                              </InputLabel>
                              <Select
                                labelId="published"
                                id="published"
                                name="published"
                                value={is_published}
                                onChange={handleFieldChange}
                                label="Abstract Published?"
                                color="secondary"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {binaryOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </MDBCol>
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
                            >
                              <InputLabel color="secondary">
                                {Publication.is_affilated}
                              </InputLabel>
                              <Select
                                labelId="affiliated"
                                id="affiliated"
                                name="affiliated"
                                value={is_affilated}
                                onChange={handleFieldChange}
                                label="Affiliated?"
                                color="secondary"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {binaryOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </MDBCol>
                        </MDBRow>

                        <MDBRow className="mb-4">
                          <MDBCol md="4">
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120 }}
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
                          </MDBCol>

                          <MDBCol md="4">
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
                          </MDBCol>
                          <MDBCol md="4">
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
                          </MDBCol>
                        </MDBRow>
                        <MDBRow className="mb-4">
                          <MDBCol md="4">
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
                          </MDBCol>

                          <MDBCol md="4">
                            <TextField
                              id="citationscopus"
                              name="citationscopus"
                              label={Publication.citation_scopus}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleFieldChange}
                            />
                          </MDBCol>
                          <MDBCol md="4">
                            <TextField
                              id="citationgoogle"
                              name="citationgoogle"
                              label={Publication.citation_google}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              onChange={handleFieldChange}
                            />
                          </MDBCol>

                        </MDBRow>
                          <FileUploadSection
                            file={file}
                            handleFileChange={handleFileChange}
                            error={!!errors.file}
                            onError={handleUploadError}
                          />
                        <Button
                          variant="contained"
                          color="secondary"
                          type="submit"
                          form="insert-data"
                          onClick={() => {
                            formRef.current.reportValidity();
                            setSend(send + 1);
                          }}
                        >
                          Submit
                        </Button>
                      </MDBCol>
                    </MDBRow>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
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

export default FirstData;
