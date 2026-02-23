import { Box, TextField, Typography } from "@mui/material";
import FileUploadSection from "../CustomComponents/FileUploadSection";

function IdFileUploadRow({
  label,
  numberField,
  fileField,
  body,
  branch,
  errors,
  getFieldLabel,
  onNumberChange,
  onFileChange,
  onFileError,
}) {
  return (
    <>
      <Typography sx={{ mt: 2, mb: 1 }}>{label}</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          mb: 1,
          justifyContent: "space-between",
          pl: 4,
          pr: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          flexDirection: { xs: "column", sm: "row", md: "row" },
          p: 2,
        }}
      >
        <TextField
          variant="standard"
          label={getFieldLabel(numberField)}
          required
          error={!!errors?.main?.[numberField]}
          helperText={errors?.main?.[numberField] ? "Required" : ""}
          value={body[numberField] || ""}
          onChange={onNumberChange}
        />

        <FileUploadSection
          file={body[fileField]}
          branch={branch}
          error={!!errors?.main?.[fileField]}
          handleFileChange={onFileChange}
          onError={onFileError}
          justifyContent="flex-start"
          containerSx={{ mt: 0 }}
          buttonSx={{ whiteSpace: "nowrap", px: 2 }}
        />
      </Box>
    </>
  );
}

export default IdFileUploadRow;
