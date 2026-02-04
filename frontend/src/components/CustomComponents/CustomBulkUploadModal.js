import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import { 
  primaryColor,
  buttonColor,
  buttonTextColor,
  hoverButtonColor,
  hoverButtonTextColor,
  errorColor,
  white,
  borderColor,
  black,
} from "../../utils/colors";

const CustomBulkUploadModal = ({
  show,
  onClose,
  onImportFile,
  onImportClick,
  onDownloadSample,
}) => {
  return (
    <Dialog
      open={show}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 3,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.65)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: `1px solid ${borderColor}`,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, letterSpacing: 0.3, color: primaryColor }}>Select File To Bulk Insert</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" component="label" htmlFor="bulkUploadFile" sx={{ fontWeight: 600 }}>
            Choose file
          </Typography>
          <input
            type="file"
            id="bulkUploadFile"
            name="file"
            required
            onChange={onImportFile}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: `1px solid ${borderColor}` }}
          />
          <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>
            Are you a first timer?
          </Typography>
          <Button
            variant="contained"
            size="medium"
            onClick={onDownloadSample}
            sx={{ 
              borderRadius: 3, 
              textTransform: 'none',
              backgroundColor: buttonColor,
              color: buttonTextColor,
              '&:hover': {
                backgroundColor: hoverButtonColor,
                color: hoverButtonTextColor,
              }
            }}
          >
            View & Download Sample File
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pt: 2 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={onImportClick}
          sx={{ 
            borderRadius: 3, 
            textTransform: 'none',
            backgroundColor: primaryColor,
            color: white,
            '&:hover': {
                backgroundColor: "transparent",
                color: primaryColor,}
          }}
        >
          Import
        </Button>
        <Button 
          variant="outlined" 
          size="medium" 
          onClick={onClose} 
          sx={{ 
            borderRadius: 3, 
            textTransform: 'none',
            color: black,
            borderColor: borderColor,
            '&:hover': { backgroundColor: "transparent", borderColor: errorColor, color: errorColor, boxShadow: `0 0 10px ${errorColor}`}
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomBulkUploadModal;
