import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";

export default function CustomConfirmDialog({
  open,
  handleClose,
  handleConfirm,
  title,
  content,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
            p:3,
            borderRadius: '25px',
            background: 'rgba(255, 255, 255, 0.65)', 
            backdropFilter: 'blur(15px)', 
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', 
            border: '1px solid rgba(255, 255, 255, 0.18)',
        }
    }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          sx={{
            color: "text.secondary",
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          {content}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            autoFocus
            sx={{
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
