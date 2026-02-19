import React, { useReducer, useMemo, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Service from "../../Service/http";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import {
  primary,
  primaryColor,
  primaryHover,
  white,
} from "../../utils/colors";

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
    Industry_Experience: "",

    Scopus_ID: "",
    WoS_ID: "",
    Google_Scholar_ID: "",
    Vidwan_ID: "",
    ORCID_ID: "",

    Fields_of_Specialization: "",
    Professional_Memberships: "",
    Invited_Talks: "",
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

    default:
      return state;
  }
}

/* ================= COMPONENT ================= */

function Profile() {
  const [state, dispatchReducer] = useReducer(reducer, initialState);
  const service = useMemo(() => new Service(), []);
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = !!location.state?.edit;
  const { body } = state;

  useEffect(() => {
    if (isEditMode && location.state?.profileData) {
      dispatchReducer({
        type: "INIT",
        value: location.state.profileData,
      });
    }
  }, [isEditMode, location]);

  const handleFileChange = (file, field, type, index = null) => {
    if (type === "main")
      dispatchReducer({ type: "SET_FIELD", field, value: file });

    if (type === "qual")
      dispatchReducer({
        type: "UPDATE_QUAL",
        index,
        field,
        value: file,
      });

    if (type === "exp")
      dispatchReducer({
        type: "UPDATE_EXP",
        index,
        field,
        value: file,
      });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
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
          typeof q.certificateFile === "string"
            ? q.certificateFile
            : "",
      };
    });

    const cleanExp = body.Experience.map((e, i) => {
      if (e.experienceFile instanceof File) {
        form.append(`exp_${i}`, e.experienceFile);
      }

      return {
        ...e,
        experienceFile:
          typeof e.experienceFile === "string"
            ? e.experienceFile
            : "",
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

  const basicFields = [
    "Name","Designation","AICTE_ID","JNTUH_ID","College_ID","branch",
    "Ratification_status","Teaching_Experience","Research_Experience","Industry_Experience",
    "Scopus_ID","WoS_ID","Google_Scholar_ID","Vidwan_ID","ORCID_ID",
    "Fields_of_Specialization","Professional_Memberships",
    "Invited_Talks","Editor_for_Journals","Reviewer_for_Journals",
  ];

  return (
    <div style={{ background:"#c5d299", minHeight:"88vh", display:"flex", alignItems:"center" }}>
      <Container maxWidth="lg">
        <Card sx={{ borderRadius:"15px" }}>
          <CardContent sx={{ p:0 }}>
            <Grid container>

              {/* ===== LEFT WHITE ===== */}
              <Grid item xs={12} md={6} sx={{ p:4, bgcolor:white }}>
                <Typography variant="h4" sx={{ mb:3, color:primaryColor }}>
                  {isEditMode ? "Edit Profile" : "Profile Information"}
                </Typography>

                <Grid container spacing={2}>
                  {basicFields.map(f=>(
                    <Grid item xs={12} sm={6}  key={f}>
                      <TextField
                        fullWidth
                        variant="standard"
                        label={f}
                        value={body[f] || ""}
                        onChange={(e)=>dispatchReducer({
                          type:"SET_FIELD",
                          field:f,
                          value:e.target.value
                        })}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Typography mt={2}>Aadhaar</Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Aadhaar Number"
                  value={body.Aadhaar_Number || ""}
                  onChange={(e)=>dispatchReducer({type:"SET_FIELD",field:"Aadhaar_Number",value:e.target.value})}
                />
                <FileUploadSection
                  file={body.Aadhaar_File}
                  branch={body.branch}
                  handleFileChange={(e)=>handleFileChange(e.target.files[0],"Aadhaar_File","main")}
                />

                <Typography mt={2}>PAN</Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  label="PAN Number"
                  value={body.PAN_Number || ""}
                  onChange={(e)=>dispatchReducer({type:"SET_FIELD",field:"PAN_Number",value:e.target.value})}
                />
                <FileUploadSection
                  file={body.PAN_File}
                  branch={body.branch}
                  handleFileChange={(e)=>handleFileChange(e.target.files[0],"PAN_File","main")}
                />

                <Typography mt={2}>Profile Photo</Typography>
                <FileUploadSection
                  file={body.Profile_Photo}
                  branch={body.branch}
                  handleFileChange={(e)=>handleFileChange(e.target.files[0],"Profile_Photo","main")}
                />
              </Grid>

              {/* ===== RIGHT GREEN ===== */}
              <Grid item xs={12} md={6} sx={{ p:4, bgcolor:primaryColor }}>

                <Typography variant="h5" sx={{ color:white }}>Qualifications</Typography>

                {body.Education_Qualifications.map((q,i)=>(
                  <Grid container spacing={1} key={i} sx={{ mb:2 }}>
                    {["level","degree","specialization","university","yearOfPassing","percentageOrCGPA"].map(f=>(
                      <Grid item xs={6} key={f}>
                        <TextField
                          fullWidth
                          variant="standard"
                          label={f}
                          value={q[f]}
                          onChange={(e)=>dispatchReducer({
                            type:"UPDATE_QUAL",
                            index:i,
                            field:f,
                            value:e.target.value
                          })}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <FileUploadSection
                        file={q.certificateFile}
                        branch={body.branch}
                        handleFileChange={(e)=>handleFileChange(e.target.files[0],"certificateFile","qual",i)}
                      />
                    </Grid>
                  </Grid>
                ))}

                <Button variant="outlined" sx={{ color:white,borderColor:white }}
                  onClick={()=>dispatchReducer({type:"ADD_QUAL"})}>
                  Add Qualification
                </Button>

                <Typography variant="h5" sx={{ color:white, mt:3 }}>Experience</Typography>

                {body.Experience.map((ex,i)=>(
                  <Grid container spacing={1} key={i}>
                    {["type","organisation","designation","fromDate","toDate"].map(f=>(
                      <Grid item xs={6} key={f}>
                        <TextField
                          fullWidth
                          variant="standard"
                          type={f.includes("Date")?"date":"text"}
                          InputLabelProps={{ shrink:true }}
                          label={f}
                          value={ex[f]}
                          onChange={(e)=>dispatchReducer({
                            type:"UPDATE_EXP",
                            index:i,
                            field:f,
                            value:e.target.value
                          })}
                        />
                      </Grid>
                    ))}

                    {/* ⭐ ADDED EXPERIENCE FILE UPLOAD */}
                    <Grid item xs={12}>
                      <FileUploadSection
                        file={ex.experienceFile}
                        branch={body.branch}
                        handleFileChange={(e)=>handleFileChange(
                          e.target.files[0],
                          "experienceFile",
                          "exp",
                          i
                        )}
                      />
                    </Grid>

                  </Grid>
                ))}

                <Button variant="outlined" sx={{ color:white,borderColor:white }}
                  onClick={()=>dispatchReducer({type:"ADD_EXP"})}>
                  Add Experience
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    mt:4,
                    backgroundColor:primary,
                    color:primaryColor,
                    "&:hover":{ backgroundColor:primaryHover, color:white }
                  }}
                  onClick={handleSubmit}
                >
                  {isEditMode ? "Update" : "Submit"}
                </Button>

              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default Profile;
