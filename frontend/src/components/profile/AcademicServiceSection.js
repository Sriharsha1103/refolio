import { Box, Grid, TextField, Typography } from "@mui/material";
import { white } from "../../utils/colors";

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
