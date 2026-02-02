import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";

const PortalToolbar = ({ addPath }) => {
  const container = document.getElementById("external-grid-toolbar");
  const navigate = useNavigate();

  if (!container) return null;

  return createPortal(
    <GridToolbarContainer>
      {addPath && (
        <Tooltip title="Add" arrow>
          <IconButton color="primary" onClick={() => navigate(addPath)}>
            <AddIcon style={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      )}
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarExport />
    </GridToolbarContainer>,
    container
  );
};
export default PortalToolbar;