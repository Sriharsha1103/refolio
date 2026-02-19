import { Box, Grid, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import { PanelIconButton } from "../CustomComponents/PanelButton";
import { white } from "../../utils/colors";

function ExperienceSection({
  body,
  dispatchReducer,
  errors,
  rightGroupSx,
  getFieldLabel,
  designationOptions,
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
          Experience
        </Typography>
        <Tooltip title="Add experience" arrow>
          <PanelIconButton
            panel="green"
            aria-label="Add experience"
            onClick={() => dispatchReducer({ type: "ADD_EXP" })}
            sx={{ position: "absolute", right: 0 }}
          >
            <AddRoundedIcon />
          </PanelIconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {["Teaching_Experience", "Research_Experience", "Industry_Experience"].map(
          (f) => (
            <Grid item xs={12} sm={6} key={f}>
              <TextField
                fullWidth
                variant="standard"
                label={getFieldLabel(f)}
                required
                error={!!errors?.main?.[f]}
                helperText={errors?.main?.[f] ? "Required" : ""}
                value={body[f] || ""}
                onChange={(e) =>
                  dispatchReducer({
                    type: "SET_FIELD",
                    field: f,
                    value: e.target.value,
                  })
                }
              />
            </Grid>
          ),
        )}
      </Grid>

      {(body.Experience || []).map((ex, i) => (
        <Grid container spacing={1} key={i} sx={{ mb: 2 }}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title="Delete experience" arrow>
              <PanelIconButton
                panel="green"
                aria-label="Delete experience"
                onClick={() => dispatchReducer({ type: "REMOVE_EXP", index: i })}
              >
                <DeleteOutlineIcon />
              </PanelIconButton>
            </Tooltip>
          </Grid>

          {["type", "organisation", "designation", "fromDate", "toDate"].map(
            (f) => (
              <Grid item xs={6} key={f}>
                {f === "designation" ? (
                  <TextField
                    fullWidth
                    select
                    variant="standard"
                    label={getFieldLabel(f)}
                    required
                    error={!!errors?.exp?.[i]?.designation}
                    helperText={errors?.exp?.[i]?.designation ? "Required" : ""}
                    value={ex[f] || ""}
                    onChange={(e) =>
                      dispatchReducer({
                        type: "UPDATE_EXP",
                        index: i,
                        field: f,
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
                ) : (
                  <TextField
                    fullWidth
                    variant="standard"
                    type={f.includes("Date") ? "date" : "text"}
                    InputLabelProps={{ shrink: true }}
                    label={getFieldLabel(f)}
                    required
                    error={!!errors?.exp?.[i]?.[f]}
                    helperText={errors?.exp?.[i]?.[f] ? "Required" : ""}
                    value={ex[f]}
                    onChange={(e) =>
                      dispatchReducer({
                        type: "UPDATE_EXP",
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
              file={ex.experienceFile}
              branch={body.branch}
              error={!!errors?.exp?.[i]?.experienceFile}
              handleFileChange={(e) =>
                handleFileChange(e.target.files[0], "experienceFile", "exp", i)
              }
            />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}

export default ExperienceSection;
