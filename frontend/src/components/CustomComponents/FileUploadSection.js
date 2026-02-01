import React from 'react';
import { MDBCol } from "mdb-react-ui-kit";
import { Button } from '@mui/material';
import Typography from "@mui/material/Typography";

const FileUploadSection = ({ file, handleFileChange, error, onError }) => {
    const [errorMessage, setErrorMessage] = React.useState("");
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
        <>
            <MDBCol md="6">
                <Button 
                    variant="contained" 
                    component="label" 
                    color={error ? "error" : "primary"}
                    style={{ marginTop: '8px' }}
                >
                    Upload File *
                    <input
                        type="file" accept=".pdf"
                        hidden
                        onChange={onFileChange}
                    />
                </Button>
                {error && (
                    <Typography variant="caption" display="block" color="error" sx={{ mt: 1 }}>
                        File is required
                    </Typography>
                )}
            </MDBCol>
            <MDBCol md="6">
                {file && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Selected file: <strong>{file.name}</strong>
                    </Typography>
                )}
            </MDBCol>
        </>
    );
};

export default FileUploadSection;
