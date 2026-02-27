import { Box, Grid, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import { PanelIconButton } from "../CustomComponents/PanelButton";
import { black, errorColor, primaryColor, white } from "../../utils/colors";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useMemo, useState } from "react";

function EducationQualificationsSection({
  body,
  dispatchReducer,
  errors,
  rightGroupSx,
  getFieldLabel,
  degreeOptions,
  handleFileChange,
  onFileError,
}) {
  const customSx = {
    "& .MuiInputBase-input": { color: black },
    "& .MuiInputLabel-root": { color: "rgba(0,0,0,0.85)" },
    "& .MuiInputLabel-root.Mui-focused": { color: black },
    "& .MuiFormHelperText-root": { color: black },
    "& .MuiInput-underline:before": {
      borderBottomColor: "rgba(0,0,0,0.25)",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "rgba(0,0,0,0.45) !important",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "rgba(0,0,0,0.7)",
    },
    "& .MuiFormLabel-root.Mui-error": { color: errorColor },
    "& .MuiInputBase-root.Mui-error:after": { borderBottomColor: errorColor },
    "& .MuiFormHelperText-root.Mui-error": { color: errorColor },
  };

  const [qualModalOpen, setQualModalOpen] = useState(false);
  const [activeQualIndex, setActiveQualIndex] = useState(null);
  const [mode, setMode] = useState(null); // "add" | "edit" | null

  const [qualifications, setQualifications] = useState(body.Education_Qualifications || []);

  useEffect(() => {
    const next = Array.isArray(body.Education_Qualifications)
      ? [...body.Education_Qualifications].sort((a, b) => {
          const ay = Number.parseInt(a?.yearOfPassing, 10);
          const by = Number.parseInt(b?.yearOfPassing, 10);

          // Put invalid/empty years at the end, otherwise sort latest first.
          const aInvalid = Number.isNaN(ay);
          const bInvalid = Number.isNaN(by);
          if (aInvalid && bInvalid) return 0;
          if (aInvalid) return 1;
          if (bInvalid) return -1;

          return by - ay;
        })
      : [];

    setQualifications(next);
  }, [body.Education_Qualifications]);

  const phdStatusOptions = [
    { value: "Registered", label: "Registered" },
    { value: "Pursuing", label: "Pursuing" },
    { value: "Completed", label: "Completed" },
  ];

  const activeQual = useMemo(() => {
    if (!qualModalOpen) return null;
    if (mode === "add") return draftQual;

    if (activeQualIndex === null || activeQualIndex === undefined) return null;
    return qualifications[activeQualIndex] || null;
  }, [qualModalOpen, mode, activeQualIndex, qualifications]);

  const [draftQual, setDraftQual] = useState(activeQual);


  const isPhd = useMemo(() => {
    if (!activeQual) return false;
    return (activeQual.degree || "").toLowerCase().includes("phd");
  }, [activeQual]);

  const yearFieldLabel = useMemo(() => {
    if (!activeQual) return getFieldLabel("yearOfPassing");
    if (!isPhd) return getFieldLabel("yearOfPassing");
    if (activeQual.phdStatus === "Completed" || draftQual?.phdStatus === "Completed") 
      return "Year of Passing"
    else 
    return "Year of Registered";
    // return draftQual?.phdStatus === "Completed" ? "Year of Passing" : "Year of Registered";
  }, [activeQual, getFieldLabel, isPhd, draftQual]);

  const openAddQual = () => {
    setMode("add");
    setActiveQualIndex(null);
    setDraftQual({
      // level: "",
      degree: "",
      specialization: "",
      university: "",
      yearOfPassing: "",
      percentageOrCGPA: "",
      phdStatus: "",
      certificateFile: null,
    });
    setQualModalOpen(true);
  };

  const openEditQual = (index) => {
    setMode("edit");
    setDraftQual(null);
    setActiveQualIndex(index);
    setQualModalOpen(true);
  };

  const closeQualModal = () => {
    setQualModalOpen(false);
    setActiveQualIndex(null);
    setMode(null);
    setDraftQual(null);
  };

  const onDone = () => {
    if (mode === "add" && draftQual) {
      // console.log("Draft Qual", draftQual);
      dispatchReducer({ type: "ADD_QUAL", value: draftQual });
    }
    closeQualModal();
  };

  const handlePhdStatusChange = (value) => {
    if (mode === "add") {
      setDraftQual((p) => ({
        ...(p || {}),
        phdStatus: value,
        yearOfPassing: "",
      }));
      return;
    }
    if(mode === 'edit'){
        const updatedQual = {
          ...activeQual,
          phdStatus: value,
          yearOfPassing: "",
        };
        // console.log("Updated Qual", updatedQual);
        setDraftQual(updatedQual);
    }

    dispatchReducer({
      type: "UPDATE_QUAL",
      index: activeQualIndex,
      field: "phdStatus",
      value: value,
    });

    // dispatchReducer({
    //   type: "UPDATE_QUAL",
    //   index: activeQualIndex,
    //   field: "yearOfPassing",
    //   value: "",
    // });
  };

  // console.log("Qualifications", qualifications);

  return (
    <Box sx={rightGroupSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: white, textAlign: "center", width: "100%" }}
        >
          Educational Qualifications
        </Typography>
        <Tooltip title="Add qualification" arrow>
          <PanelIconButton
            panel="green"
            aria-label="Add qualification"
            onClick={openAddQual}
          >
            <AddRoundedIcon />
          </PanelIconButton>
        </Tooltip>
      </Box>


      {(qualifications || []).map((q, i) => (
        
        <Box
          key={i}
          sx={{
            mb: 1.5,
            p: 1.25,
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: white, fontWeight: 600, display: "flex",justifyContent:"flex-start" }} noWrap>
                {(q.degree || "Qualification")} {q.specialization ? `- ${q.specialization}` : ""}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.75)" }} noWrap>
                {[q.university, q.yearOfPassing].filter(Boolean).join(" • ")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title="Edit qualification" arrow>
                <PanelIconButton
                  panel="green"
                  aria-label="Edit qualification"
                  onClick={() => openEditQual(i)}
                >
                  <EditOutlinedIcon />
                </PanelIconButton>
              </Tooltip>

              <Tooltip title="Delete qualification" arrow>
                <PanelIconButton
                  panel="green"
                  aria-label="Delete qualification"
                  onClick={() =>
                    dispatchReducer({
                      type: "REMOVE_QUAL",
                      index: i,
                    })
                  }
                >
                  <DeleteOutlineIcon />
                </PanelIconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      ))}

      <Dialog
        open={qualModalOpen}
        onClose={closeQualModal}
        fullWidth
        disableEscapeKeyDown
        maxWidth="sm"
        paperProps={{ sx: { backgroundColor: white, color: primaryColor, padding: 4, borderRadius: 3 } }}
        BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.3)" } }}
      >
        <DialogTitle sx={{ color: primaryColor, fontWeight: 600, fontSize: 20 }}>
          {mode === "edit" ? "Edit Qualification" : "Add Qualification"}
        </DialogTitle>

        <DialogContent sx={{ pt: 1}}>
          {!activeQual ? (
            <Typography sx={{ color: black, py: 2 }}>Loading...</Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {[
                "degree",
                "specialization",
                "university",
                "yearOfPassing",
                "phdStatus",
                "percentageOrCGPA",
              ]
                .filter((f) => (f === "phdStatus" ? isPhd : true))
                .map((f) => (
                  <Grid item xs={12} sm={6} key={f}>
                    {f === "degree" ? (
                      <TextField
                        fullWidth
                        select
                        variant="standard"
                        label={getFieldLabel(f)}
                        required
                        error={!!errors?.qual?.[activeQualIndex]?.degree}
                        helperText={errors?.qual?.[activeQualIndex]?.degree ? "Required" : ""}
                        sx={{ ...customSx }}
                        value={activeQual[f] || ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          const nextIsPhd = (value || "").toLowerCase().includes("phd");

                          if (mode === "add") {
                            setDraftQual((p) => ({
                              ...(p || {}),
                              [f]: value,
                              ...(nextIsPhd ? null : { phdStatus: "" }),
                            }));
                            return;
                          }

                          dispatchReducer({
                            type: "UPDATE_QUAL",
                            index: activeQualIndex,
                            field: f,
                            value,
                          });

                          if (!nextIsPhd) {
                            dispatchReducer({
                              type: "UPDATE_QUAL",
                              index: activeQualIndex,
                              field: "phdStatus",
                              value: "",
                            });
                          }
                        }}
                      >
                        {degreeOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : f === "phdStatus" ? (
                      <TextField
                        fullWidth
                        select
                        variant="standard"
                        label="PhD Status"
                        sx={{ ...customSx }}
                        value={mode==="add" ? activeQual[f] : draftQual?.[f] || activeQual[f] || ""}
                        onChange={(e) => handlePhdStatusChange(e.target.value)}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {phdStatusOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        fullWidth
                        variant="standard"
                        label={f === "yearOfPassing" ? yearFieldLabel : getFieldLabel(f)}
                        required
                        error={!!errors?.qual?.[activeQualIndex]?.[f]}
                        helperText={errors?.qual?.[activeQualIndex]?.[f] ? "Required" : ""}
                        sx={{ ...customSx }}
                        value={mode === "add" ? activeQual[f] : draftQual?.[f] || activeQual[f] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (mode === "add") {
                            setDraftQual((p) => ({ ...(p || {}), [f]: value }));
                            return;
                          }
                          dispatchReducer({
                            type: "UPDATE_QUAL",
                            index: activeQualIndex,
                            field: f,
                            value,
                          });
                        }}
                      />
                    )}
                  </Grid>
                ))}

              <Grid item xs={12} sx={{ mt: 1 }}>
                <FileUploadSection
                  file={activeQual.certificateFile}
                  branch={body.branch}
                  error={!!errors?.qual?.[activeQualIndex]?.certificateFile}
                  handleFileChange={(e) => {
                    const file = e.target.files[0];
                    if (mode === "add") {
                      setDraftQual((p) => ({ ...(p || {}), certificateFile: file }));
                      return;
                    }
                    handleFileChange(file, "certificateFile", "qual", activeQualIndex);
                  }}
                  onError={onFileError}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeQualModal} variant="text">
            Cancel
          </Button>
          <Button onClick={onDone} variant="contained" color="success">
            {mode === 'edit' ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EducationQualificationsSection;
