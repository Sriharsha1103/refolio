import { useEffect, useMemo, useState } from "react";
import { Box, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FileUploadSection from "../CustomComponents/FileUploadSection";

function ProfilePhotoUpload({ file, branch, handleFileChange, onFileError, error = false }) {
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const safeBranch = branch || "common";

  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setObjectUrl(null);
    return undefined;
  }, [file]);

  const imageSrc = useMemo(() => {
    if (objectUrl) return objectUrl;

    if (typeof file === "string" && file) {
      return `${backendURL}/uploads/${safeBranch}/${file}`;
    }

    return null;
  }, [backendURL, file, objectUrl, safeBranch]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
      <FileUploadSection
        file={file}
        branch={branch}
        handleFileChange={handleFileChange}
        onError={onFileError}
        error={error}
        accept="image/*"
        buttonAriaLabel="Upload profile photo"
        direction="column"
        alignItems="center"
        justifyContent="center"
        containerSx={{ gap: 1 }}
        buttonSx={{
          borderRadius: "50%",
          p: 0,
          minWidth: 0,
          overflow: "hidden",
        }}
        showFileName = {false}
      >
        <Avatar
          src={imageSrc || undefined}
          sx={{ width: 128, height: 128 }}
          alt="Profile photo"
        >
          {!imageSrc ? <PersonIcon sx={{ fontSize: 64 }} /> : null}
        </Avatar>
      </FileUploadSection>
    </Box>
  );
}

export default ProfilePhotoUpload;
