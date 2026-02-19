import React from "react";
import { Button, Box, Typography, FormHelperText, Tooltip } from "@mui/material";
import { primary, primaryColor, primaryHover, white } from "../../utils/colors";

const FileUploadSection = ({
  file,
  handleFileChange,
  error,
  onError,
  branch,
  accept = ".pdf,.jpg,.jpeg,.png",
  buttonText = "Upload File",
  buttonAriaLabel,
  buttonSx,
  containerSx,
  direction = "row",
  alignItems = "center",
  justifyContent = "space-evenly",
  showFileName = true,
  children,
}) => {

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
  const safeBranch = branch || "common";

  const getFileName = () => {
    if (!file) return null;

    if (typeof file === "string") return file;
    if (file instanceof File) return file.name;

    return null;
  };

  const fileName = getFileName();
  const isRemoteFile = typeof file === "string";

  const maxDisplayChars = 10;
  const shouldTruncate = !!fileName && fileName.length > maxDisplayChars;
  const truncatedFileName =
    shouldTruncate ? `${fileName.slice(0, maxDisplayChars - 3)}...` : fileName;

  const fileNameSx = {
    display: "inline-block",
    maxWidth: "15ch",
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
        {children || buttonText}
        <input
          type="file"
          accept={accept}
          
          hidden
          onChange={onFileChange}
        />
      </Button>

      {showFileName && fileName && (
        <Typography variant="body2">
          File:{" "}
          <Tooltip title={fileName} disableHoverListener={!shouldTruncate}>
            <Box component="span" sx={fileNameSx}>
              {isRemoteFile ? (
                <a
                  href={`${backendURL}/uploads/${safeBranch}/${fileName}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1976d2", textDecoration: "none" }}
                >
                  <span className="truncated">{truncatedFileName}</span>
                  <span className="full">{fileName}</span>
                </a>
              ) : (
                <>
                  <span className="truncated">{truncatedFileName}</span>
                  <span className="full">{fileName}</span>
                </>
              )}
            </Box>
          </Tooltip>
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
