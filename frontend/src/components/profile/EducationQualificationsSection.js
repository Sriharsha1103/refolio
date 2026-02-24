import { Box, Grid, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import { PanelIconButton } from "../CustomComponents/PanelButton";
import { black, errorColor, primaryColor, white } from "../../utils/colors";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useMemo, useState } from "react";

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
  const [draftQual, setDraftQual] = useState(null);

  const qualifications = body.Education_Qualifications || [];

  const activeQual = useMemo(() => {
    if (!qualModalOpen) return null;
    if (mode === "add") return draftQual;

    if (activeQualIndex === null || activeQualIndex === undefined) return null;
    return qualifications[activeQualIndex] || null;
  }, [qualModalOpen, mode, draftQual, activeQualIndex, qualifications]);

  const openAddQual = () => {
    setMode("add");
    setActiveQualIndex(null);
    setDraftQual({
      level: "",
      degree: "",
      specialization: "",
      university: "",
      yearOfPassing: "",
      percentageOrCGPA: "",
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
              <Typography sx={{ color: white, fontWeight: 600 }} noWrap>
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
                "level",
                "degree",
                "specialization",
                "university",
                "yearOfPassing",
                "percentageOrCGPA",
              ].map((f) => (
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
                    >
                      {degreeOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      variant="standard"
                      label={getFieldLabel(f)}
                      required
                      error={!!errors?.qual?.[activeQualIndex]?.[f]}
                      helperText={errors?.qual?.[activeQualIndex]?.[f] ? "Required" : ""}
                      sx={{ ...customSx }}
                      value={activeQual[f] || ""}
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
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EducationQualificationsSection;
