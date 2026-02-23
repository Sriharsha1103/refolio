import { Box, Grid, Typography } from "@mui/material";
import { primaryColor } from "../../utils/colors";

function ResearchProfileSection({ leftGroupSx, renderField }) {
  return (
    <Box sx={leftGroupSx}>
      <Typography variant="h6" sx={{ color: primaryColor, mb: 1 }}>
        Research Profile
      </Typography>
      <Grid container spacing={2}>
        {["Scopus_ID", "WoS_ID", "Google_Scholar_ID", "Vidwan_ID", "ORCID_ID"].map(
          (f) => (
            <Grid item xs={12} sm={6} key={f}>
              {renderField(f, { fullWidth: true }, "left")}
            </Grid>
          ),
        )}

        <Box
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 6,
            ml: 2,
            p: 2,
            justifyContent: "space-between",
          }}
        >
          {["Fields_of_Specialization", "Invited_Talks"].map((f) => (
            <Grid item xs={12} key={f}>
              {renderField(f)}
            </Grid>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}

export default ResearchProfileSection;
