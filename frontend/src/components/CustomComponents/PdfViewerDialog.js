import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import {
  primaryColor,
  buttonColor,
  buttonTextColor,
  hoverButtonColor,
  hoverButtonTextColor,
  borderColor,
  white,
  black,
} from "../../utils/colors";

const PdfViewerDialog = ({ open, onClose, title, fileUrl }) => {
  const hasFile = Boolean(fileUrl);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          p: 2,
          borderRadius: 4,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${borderColor}`,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: primaryColor }}>
        {title || "View File"}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        {hasFile ? (
          <Box sx={{ height: "70vh" }}>
            <iframe
              title={title || "PDF Preview"}
              src={fileUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40vh",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              No document Uploaded
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {hasFile && (
          <Button
            variant="contained"
            size="medium"
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              backgroundColor: buttonColor,
              color: buttonTextColor,
              mr: 1,
              "&:hover": {
                backgroundColor: hoverButtonColor,
                color: hoverButtonTextColor,
              },
            }}
          >
            Open in New Tab
          </Button>
        )}
        <Button
          variant="outlined"
          size="medium"
          onClick={onClose}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            color: black,
            borderColor: borderColor,
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: primaryColor,
              color: primaryColor,
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PdfViewerDialog;
