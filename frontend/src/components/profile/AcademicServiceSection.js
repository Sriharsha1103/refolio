import { Box, Grid, TextField, Typography } from "@mui/material";
import { errorColor, white } from "../../utils/colors";

function AcademicServiceSection({ body, dispatchReducer, errors, rightGroupSx, getFieldLabel }) {
  return (
    <Box sx={rightGroupSx}>
      <Typography variant="h6" sx={{ color: white, mb: 1 }}>
        Academic Service
      </Typography>
      <Grid container spacing={2}>
        {["Editor_for_Journals", "Reviewer_for_Journals"].map((f) => (
          <Box
            key={f}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 6,
              alignItems: "center",
              justifyContent: "space-between",
              pl: 2,
              pr: 2,
            }}
          >
            <Grid item xs={12} key={f}>
              <TextField
                fullWidth
                variant="standard"
                label={getFieldLabel(f)}
                required
                error={!!errors?.main?.[f]}
                helperText={errors?.main?.[f] ? "Required" : ""}
                sx={{
                  "& .MuiInputBase-input": { color: white },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.85)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: white },
                  "& .MuiFormHelperText-root": { color: white },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "rgba(255,255,255,0.25)",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "rgba(255,255,255,0.45) !important",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "rgba(255,255,255,0.7)",
                  },
                  "& .MuiFormLabel-root.Mui-error": { color: errorColor },
                  "& .MuiInputBase-root.Mui-error:after": {
                    borderBottomColor: errorColor,
                  },
                  "& .MuiFormHelperText-root.Mui-error": { color: errorColor },
                }}
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
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

export default AcademicServiceSection;
