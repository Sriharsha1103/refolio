import { Box, Grid, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import { PanelIconButton } from "../CustomComponents/PanelButton";
import { white } from "../../utils/colors";

function EducationQualificationsSection({
  body,
  dispatchReducer,
  errors,
  rightGroupSx,
  getFieldLabel,
  degreeOptions,
  handleFileChange,
}) {
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
            onClick={() => dispatchReducer({ type: "ADD_QUAL" })}
          >
            <AddRoundedIcon />
          </PanelIconButton>
        </Tooltip>
      </Box>

      {(body.Education_Qualifications || []).map((q, i) => (
        <Grid container spacing={1} key={i} sx={{ mb: 2 }}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
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
          </Grid>

          {["level", "degree", "specialization", "university", "yearOfPassing", "percentageOrCGPA"].map(
            (f) => (
              <Grid item xs={6} key={f}>
                {f === "degree" ? (
                  <TextField
                    fullWidth
                    select
                    variant="standard"
                    label={getFieldLabel(f)}
                    required
                    error={!!errors?.qual?.[i]?.degree}
                    helperText={errors?.qual?.[i]?.degree ? "Required" : ""}
                    value={q[f] || ""}
                    onChange={(e) =>
                      dispatchReducer({
                        type: "UPDATE_QUAL",
                        index: i,
                        field: f,
                        value: e.target.value,
                      })
                    }
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
                    error={!!errors?.qual?.[i]?.[f]}
                    helperText={errors?.qual?.[i]?.[f] ? "Required" : ""}
                    value={q[f]}
                    onChange={(e) =>
                      dispatchReducer({
                        type: "UPDATE_QUAL",
                        index: i,
                        field: f,
                        value: e.target.value,
                      })
                    }
                  />
                )}
              </Grid>
            ),
          )}

          <Grid item xs={12}>
            <FileUploadSection
              file={q.certificateFile}
              branch={body.branch}
              error={!!errors?.qual?.[i]?.certificateFile}
              handleFileChange={(e) =>
                handleFileChange(e.target.files[0], "certificateFile", "qual", i)
              }
            />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}

export default EducationQualificationsSection;
