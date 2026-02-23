import React from "react";
import { Button, Box, Typography, FormHelperText, Tooltip } from "@mui/material";
import { primary, primaryColor, primaryHover, white } from "../../utils/colors";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const FileUploadSection = ({
  file,
  handleFileChange,
  error,
  onError,
  branch,
  accept = ".pdf,.jpg,.jpeg,.png",
  buttonAriaLabel,
  buttonSx,
  containerSx,
  direction = "row",
  alignItems = "center",
  justifyContent = "space-evenly",
  showFileName = true,
  children,
  showPreviewIcon = true,
  previewAriaLabel = "View file",
}) => {

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

    if (selectedFile && selectedFile.size > MAX_FILE_SIZE_BYTES) {
      if (onError) onError("File size must be less than 1MB");
      e.target.value = null;
      return;
    }
    handleFileChange(e);
  };

  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const safeBranch = branch || "common";

  const getFileName = () => {
    if (!file) return null;

    if (typeof file === "string") return file;
    if (file instanceof File) return file.name;

    return null;
  };

  const openFile = () => {
    if (!file) return;

    if (typeof file === "string") {
      window.open(`${backendURL}/uploads/${safeBranch}/${file}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  const fileName = getFileName();
  const isRemoteFile = typeof file === "string";

  const maxDisplayChars = 30;
  const shouldTruncate = !!fileName && fileName.length > maxDisplayChars;
  const truncatedFileName =
    shouldTruncate ? `${fileName.slice(0, maxDisplayChars - 3)}...` : fileName;

  const fileNameSx = {
    display: "inline-block",
    maxWidth: "25ch",
    overflow: "hidden",
    whiteSpace: "nowrap",
    verticalAlign: "bottom",
    "& .full": {
      display: "none",
    },
    "&:hover .truncated": {
      display: "none",
    },
    "&:hover .full": {
      display: "inline-block",
      animation: shouldTruncate ? "fileNameMarquee 6s linear infinite" : "none",
    },
    "@keyframes fileNameMarquee": {
      "0%": { transform: "translateX(0%)" },
      "100%": { transform: "translateX(-100%)" },
    },
  };

  const hasFile = !!fileName;
  const isLocalSelectedFile = file instanceof File;
  const showSelectedFileText = showFileName && isLocalSelectedFile && hasFile;

  return (
    <Box
      display="flex"
      flexDirection={direction}
      gap={1}
      sx={{ mt: 2, ...containerSx }}
      alignItems={alignItems}
      justifyContent={justifyContent}
    >
      <Button
        variant="contained"
        component="label"
        color={error ? "error" : "secondary"}
        aria-label={buttonAriaLabel}
        sx={{
          backgroundColor: primary,
          color: primaryColor,
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: primaryHover,
            color: white,
          },
          ...buttonSx,
        }}
      >
        {children || <FileUploadIcon />}
        <input type="file" accept={accept} hidden onChange={onFileChange} />
      </Button>
      {showSelectedFileText ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* <Typography variant="body2">File: </Typography> */}

          {showPreviewIcon && hasFile ? (
            // <Tooltip title="View" arrow>
            <Tooltip title={fileName} disableHoverListener={!shouldTruncate}>
              <IconButton
                size="small"
                aria-label={previewAriaLabel}
                onClick={openFile}
                sx={{ color: "#1976d2" }}
              >
                <VisibilityIcon fontSize="inherit" />
              </IconButton>
              {/* <Box component="span" sx={fileNameSx}>
                <span className="truncated">{truncatedFileName}</span>
                <span className="full">{fileName}</span>
              </Box> */}
            </Tooltip>
          ) : // </Tooltip>
          null}
        </Box>
      ) : showPreviewIcon && hasFile ? (
        <Tooltip title="View" arrow>
          <IconButton
            size="small"
            aria-label={previewAriaLabel}
            onClick={openFile}
            sx={{ color: "#1976d2" }}
          >
            <VisibilityIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      ) : null}

      {error && <FormHelperText error>File is required</FormHelperText>}
    </Box>
  );
};
export default FileUploadSection;
