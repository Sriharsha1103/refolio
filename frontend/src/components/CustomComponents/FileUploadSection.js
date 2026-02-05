import React from 'react';
import { Button, Box, Typography, FormHelperText } from '@mui/material';
import { primary, primaryColor, primaryHover, white  } from '../../utils/colors';

const FileUploadSection = ({ file, handleFileChange, error, onError }) => {
    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 1024 * 1024) { 
            if (onError) onError("File size must be less than 1MB");
            e.target.value = null; 
            return;
        }
        handleFileChange(e);
    };

    return (
        <Box display="flex" alignItems="center" flexDirection="row" flexWrap="wrap" gap={2} sx={{ }}>
            <Button 
                variant="contained" 
                component="label" 
                color={error ? "error" : "secondary"}
                sx={{ mt: { xs: 2, md: 0 }, backgroundColor: primary, color:primaryColor, fontWeight:'bold', '&:hover': { backgroundColor: primaryHover, color: white }, width: 'auto' }}
            >
                Upload File *
                <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={onFileChange}
                />
            </Button>
            <Box display="flex" alignItems="center" gap={2} sx={{ mt: 1 }}>
                {file && (
                    <Typography variant="body2">
                        Selected file: <strong>{file.name}</strong>
                    </Typography>
                )}
                {error && (
                    <FormHelperText error sx={{ m: 0 }}>
                        File is required
                    </FormHelperText>
                )}
            </Box>
        </Box>
    );
};

export default FileUploadSection;
