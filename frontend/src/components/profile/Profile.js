import { useReducer, useMemo, useEffect, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Service from "../../Service/http";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import IdFileUploadRow from "./IdFileUploadRow";
import ExperienceSection from "./ExperienceSection";
import EducationQualificationsSection from "./EducationQualificationsSection";
import PanelButton from "../CustomComponents/PanelButton";
import { primaryColor, white } from "../../utils/colors";
import { branchOptions, degreeOptions, designationOptions, fieldLabelMap, requiredMainFields } from "../../utils/constants";
import ResearchProfileSection from "./ResearchProfileSection";
import AcademicServiceSection from "./AcademicServiceSection";

/* ================= INITIAL STATE ================= */

const initialState = {
  body: {
    Name: "",
    Designation: "",
    AICTE_ID: "",
    JNTUH_ID: "",
    College_ID: "",
    branch: "",

    Aadhaar_Number: "",
    Aadhaar_File: null,
    PAN_Number: "",
    PAN_File: null,
    Profile_Photo: null,

    Ratification_status: "",
    Teaching_Experience: "",
    Research_Experience: "",
    Industry_Experience: "0",

    Scopus_ID: "",
    WoS_ID: "",
    Google_Scholar_ID: "",
    Vidwan_ID: "",
    ORCID_ID: "",

    Fields_of_Specialization: "",
    Professional_Memberships: "",
    Invited_Talks: "0",
    Editor_for_Journals: "",
    Reviewer_for_Journals: "",

    Education_Qualifications: [],
    Experience: [],
  },
};

/* ================= REDUCER ================= */

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, body: action.value };

    case "SET_FIELD":
      return {
        ...state,
        body: { ...state.body, [action.field]: action.value },
      };

    case "ADD_QUAL":
      return {
        ...state,
        body: {
          ...state.body,
          Education_Qualifications: [
            ...state.body.Education_Qualifications,
            {
              level: "",
              degree: "",
              specialization: "",
              university: "",
              yearOfPassing: "",
              percentageOrCGPA: "",
              certificateFile: "",
            },
          ],
        },
      };

    case "UPDATE_QUAL": {
      const q = [...state.body.Education_Qualifications];
      q[action.index][action.field] = action.value;
      return { ...state, body: { ...state.body, Education_Qualifications: q } };
    }

    case "REMOVE_QUAL": {
      const q = state.body.Education_Qualifications.filter(
        (_, idx) => idx !== action.index,
      );
      return { ...state, body: { ...state.body, Education_Qualifications: q } };
    }

    case "ADD_EXP":
      return {
        ...state,
        body: {
          ...state.body,
          Experience: [
            ...state.body.Experience,
            {
              type: "",
              organisation: "",
              designation: "",
              fromDate: "",
              toDate: "",
              currentlyWorking: false,
              experienceFile: "",
            },
          ],
        },
      };

    case "UPDATE_EXP": {
      const e = [...state.body.Experience];
      e[action.index][action.field] = action.value;
      return { ...state, body: { ...state.body, Experience: e } };
    }

    case "REMOVE_EXP": {
      const e = state.body.Experience.filter((_, idx) => idx !== action.index);
      return { ...state, body: { ...state.body, Experience: e } };
    }

    default:
      return state;
  }
}

/* ================= COMPONENT ================= */

function Profile() {
  const [state, dispatchReducer] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState({ main: {}, qual: [], exp: [] });
  const service = useMemo(() => new Service(), []);
  const navigate = useNavigate();
  const location = useLocation();

  const omitKey = (obj, key) => {
    const { [key]: _omitted, ...rest } = obj || {};
    return rest;
  };

  const dispatch = (action) => {
    dispatchReducer(action);

    setErrors((prev) => {
      if (!prev) return prev;

      switch (action?.type) {
        case "INIT":
          return { main: {}, qual: [], exp: [] };

        case "SET_FIELD": {
          if (!action.field) return prev;
          return { ...prev, main: omitKey(prev.main, action.field) };
        }

        case "ADD_QUAL":
          return {
            ...prev,
            qual: [...(Array.isArray(prev.qual) ? prev.qual : []), {}],
          };

        case "UPDATE_QUAL": {
          if (action.index === undefined || action.index === null || !action.field)
            return prev;
          const qual = Array.isArray(prev.qual) ? [...prev.qual] : [];
          if (!qual[action.index]) qual[action.index] = {};
          qual[action.index] = omitKey(qual[action.index], action.field);
          return { ...prev, qual };
        }

        case "REMOVE_QUAL": {
          if (action.index === undefined || action.index === null) return prev;
          const qual = Array.isArray(prev.qual) ? [...prev.qual] : [];
          qual.splice(action.index, 1);
          return { ...prev, qual };
        }

        case "ADD_EXP":
          return {
            ...prev,
            exp: [...(Array.isArray(prev.exp) ? prev.exp : []), {}],
          };

        case "UPDATE_EXP": {
          if (action.index === undefined || action.index === null || !action.field)
            return prev;
          const exp = Array.isArray(prev.exp) ? [...prev.exp] : [];
          if (!exp[action.index]) exp[action.index] = {};
          exp[action.index] = omitKey(exp[action.index], action.field);
          return { ...prev, exp };
        }

        case "REMOVE_EXP": {
          if (action.index === undefined || action.index === null) return prev;
          const exp = Array.isArray(prev.exp) ? [...prev.exp] : [];
          exp.splice(action.index, 1);
          return { ...prev, exp };
        }

        default:
          return prev;
      }
    });
  };

  const isEditMode = !!location.state?.edit;
  const { body } = state;

  useEffect(() => {
    if (isEditMode && location.state?.profileData) {
      dispatch({
        type: "INIT",
        value: location.state.profileData,
      });
    }
  }, [isEditMode, location]);

  const handleFileChange = (file, field, type, index = null) => {
    if (type === "main")
      dispatch({ type: "SET_FIELD", field, value: file });

    if (type === "qual")
      dispatch({
        type: "UPDATE_QUAL",
        index,
        field,
        value: file,
      });

    if (type === "exp")
      dispatch({
        type: "UPDATE_EXP",
        index,
        field,
        value: file,
      });
  };

  const isBlank = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    return false;
  };

  const validateAll = () => {
    

    const mainErrors = requiredMainFields.reduce((acc, key) => {
      if (isBlank(body[key])) acc[key] = true;
      return acc;
    }, {});

    const qualErrors = (body.Education_Qualifications || []).map((q) => {
      const qErr = {};
      [
        "level",
        "degree",
        "specialization",
        "university",
        "yearOfPassing",
        "percentageOrCGPA",
        "certificateFile",
      ].forEach((k) => {
        if (isBlank(q?.[k])) qErr[k] = true;
      });
      return qErr;
    });

    const expErrors = (body.Experience || []).map((e) => {
      const eErr = {};
      ["type", "organisation", "designation", "fromDate"].forEach((k) => {
        if (isBlank(e?.[k])) eErr[k] = true;
      });

      if (!e?.currentlyWorking && isBlank(e?.toDate)) {
        eErr.toDate = true;
      }

      if (isBlank(e?.experienceFile)) {
        eErr.experienceFile = true;
      }

      return eErr;
    });

    const hasQualErrors = qualErrors.some((q) => Object.keys(q).length > 0);
    const hasExpErrors = expErrors.some((e) => Object.keys(e).length > 0);
    const hasMainErrors = Object.keys(mainErrors).length > 0;

    setErrors({ main: mainErrors, qual: qualErrors, exp: expErrors });

    return !(hasMainErrors || hasQualErrors || hasExpErrors);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const isValid = validateAll();
    if (!isValid) return;

    const form = new FormData();

    Object.keys(body).forEach((k) => {
      if (k !== "Education_Qualifications" && k !== "Experience") {
        form.append(k, body[k]);
      }
    });

    const cleanQual = body.Education_Qualifications.map((q, i) => {
      if (q.certificateFile instanceof File) {
        form.append(`qual_${i}`, q.certificateFile);
      }

      return {
        ...q,
        certificateFile:
          typeof q.certificateFile === "string" ? q.certificateFile : "",
      };
    });

    const cleanExp = body.Experience.map((e, i) => {
      if (e.experienceFile instanceof File) {
        form.append(`exp_${i}`, e.experienceFile);
      }

      return {
        ...e,
        experienceFile:
          typeof e.experienceFile === "string" ? e.experienceFile : "",
      };
    });

    form.append("Education_Qualifications", JSON.stringify(cleanQual));
    form.append("Experience", JSON.stringify(cleanExp));

    if (isEditMode) {
      await service.put("api/profile/data/" + body._id, form);
    } else {
      await service.post("api/profile/data", form);
    }

    navigate("/profiles");
  };

 

  const leftGroupSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
    p: 2,
    mb: 2,
  };

  const rightGroupSx = {
    border: `1px solid ${white}`,
    borderRadius: 2,
    p: 2,
    mb: 2,
  };
  

  const getFieldLabel = (key) => fieldLabelMap[key] || key;

  const renderField = (field, width) => {
    if (field === "Designation") {
      return (
        <TextField
          fullWidth
          select
          variant="standard"
          label="Designation"
          required
          error={!!errors.main?.Designation}
          helperText={errors.main?.Designation ? "Required" : ""}
          value={body.Designation || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "Designation",
              value: e.target.value,
            })
          }
        >
          {designationOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (field === "branch") {
      return (
        <TextField
          fullWidth
          select
          variant="standard"
          label="Branch"
          required
          error={!!errors.main?.branch}
          helperText={errors.main?.branch ? "Required" : ""}
          value={body.branch || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "branch",
              value: e.target.value,
            })
          }
        >
          {branchOptions?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        variant="standard"
        label={getFieldLabel(field)}
        required
        error={!!errors.main?.[field]}
        helperText={errors.main?.[field] ? "Required" : ""}
        value={body[field] || ""}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field,
            value: e.target.value,
          })
        }
      />
    );
  };

  return (
    <div
      style={{
        background: "#c5d299",
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: "15px" }}>
          <CardContent sx={{ p: 0 }}>
            <Grid container>
              {/* ===== LEFT WHITE ===== */}
              <Grid item xs={12} md={6} sx={{ p: 4, bgcolor: white }}>
                <Typography variant="h4" sx={{ mb: 3, color: primaryColor }}>
                  {isEditMode ? "Edit Profile" : "Profile Information"}
                </Typography>

                <Box sx={leftGroupSx}>
                  <Typography variant="h6" sx={{ color: primaryColor, mb: 1 }}>
                    Basic Info
                  </Typography>
                  <Grid container spacing={2}>
                    {["Name", "Designation"].map((f) => (
                      <Grid item xs={12} sm={6} key={f}>
                        {renderField(f)}
                      </Grid>
                    ))}
                  </Grid>

                  <IdFileUploadRow
                    label="Aadhaar"
                    numberField="Aadhaar_Number"
                    fileField="Aadhaar_File"
                    body={body}
                    branch={body.branch}
                    errors={errors}
                    getFieldLabel={getFieldLabel}
                    onNumberChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "Aadhaar_Number",
                        value: e.target.value,
                      })
                    }
                    onFileChange={(e) =>
                      handleFileChange(e.target.files[0], "Aadhaar_File", "main")
                    }
                  />

                  <IdFileUploadRow
                    label="PAN"
                    numberField="PAN_Number"
                    fileField="PAN_File"
                    body={body}
                    branch={body.branch}
                    errors={errors}
                    getFieldLabel={getFieldLabel}
                    onNumberChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "PAN_Number",
                        value: e.target.value,
                      })
                    }
                    onFileChange={(e) =>
                      handleFileChange(e.target.files[0], "PAN_File", "main")
                    }
                  />
                </Box>

                <Box sx={leftGroupSx}>
                  <Typography variant="h6" sx={{ color: primaryColor, mb: 1 }}>
                    Institutional Details
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      "AICTE_ID",
                      "JNTUH_ID",
                      "College_ID",
                      "branch",
                      "Ratification_status",
                    ].map((f) => (
                      <Grid item xs={12} sm={6} key={f}>
                        {renderField(f)}
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <ResearchProfileSection leftGroupSx={leftGroupSx} renderField={renderField} />
              </Grid>

              {/* ===== RIGHT GREEN ===== */}
              <Grid item xs={12} md={6} sx={{ p: 4, bgcolor: primaryColor }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                  }}
                >
                  <ProfilePhotoUpload
                    file={body.Profile_Photo}
                    branch={body.branch}
                    error={!!errors.main?.Profile_Photo}
                    handleFileChange={(e) =>
                      handleFileChange(
                        e.target.files[0],
                        "Profile_Photo",
                        "main",
                      )
                    }
                  />
                </Box>
                <ExperienceSection
                  body={body}
                  dispatchReducer={dispatch}
                  errors={errors}
                  rightGroupSx={rightGroupSx}
                  getFieldLabel={getFieldLabel}
                  designationOptions={designationOptions}
                  handleFileChange={handleFileChange}
                />

                <EducationQualificationsSection
                  body={body}
                  dispatchReducer={dispatch}
                  errors={errors}
                  rightGroupSx={rightGroupSx}
                  getFieldLabel={getFieldLabel}
                  degreeOptions={degreeOptions}
                  handleFileChange={handleFileChange}
                />

                <Box sx={rightGroupSx}>
                  <Typography variant="h6" sx={{ color: white, mb: 1 }}>
                    Memberships & Affiliations
                  </Typography>
                  <TextField
                    fullWidth
                    variant="standard"
                    label={getFieldLabel("Professional_Memberships")}
                    required
                    error={!!errors.main?.Professional_Memberships}
                    helperText={errors.main?.Professional_Memberships ? "Required" : ""}
                    value={body.Professional_Memberships || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "Professional_Memberships",
                        value: e.target.value,
                      })
                    }
                  />
                </Box>
                <AcademicServiceSection body={body} dispatchReducer={dispatch} errors={errors} rightGroupSx={rightGroupSx} getFieldLabel={getFieldLabel} />

                <PanelButton
                  panel="green"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  {isEditMode ? "Update" : "Submit"}
                </PanelButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default Profile;
