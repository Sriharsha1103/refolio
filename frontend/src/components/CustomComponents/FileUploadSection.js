import React from "react";
import { Button, Box, Typography, FormHelperText } from "@mui/material";
import { primary, primaryColor, primaryHover, white } from "../../utils/colors";

const FileUploadSection = ({ file, handleFileChange, error, onError, branch }) => {

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.size > 1024 * 1024) {
      if (onError) onError("File size must be less than 200MB");
      e.target.value = null;
      return;
    }

    handleFileChange(e);
  };

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const getFileName = () => {
    if (!file) return null;

    if (typeof file === "string") return file;
    if (file instanceof File) return file.name;

    return null;
  };

  const fileName = getFileName();

  return (
    <Box display="flex" flexDirection="column" gap={1}>

      <Button
        variant="contained"
        component="label"
        color={error ? "error" : "secondary"}
        sx={{
          backgroundColor: primary,
          color: primaryColor,
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: primaryHover,
            color: white,
          },
        }}
      >
        Upload File
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          hidden
          onChange={onFileChange}
        />
      </Button>

      {fileName && (
        <Typography variant="body2">
          File:{" "}
          <a
            href={`${backendURL}/uploads/${branch}/${fileName}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#1976d2" }}
          >
            {fileName}
          </a>
        </Typography>
      )}

      {error && (
        <FormHelperText error>
          File is required
        </FormHelperText>
      )}

    </Box>
  );
};
export default FileUploadSection;
