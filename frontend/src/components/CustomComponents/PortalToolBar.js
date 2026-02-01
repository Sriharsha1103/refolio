import { createPortal } from "react-dom";
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";

const PortalToolbar = () => {
  const container = document.getElementById("external-grid-toolbar");

  if (!container) return null;

  return createPortal(
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarExport />
    </GridToolbarContainer>,
    container
  );
};
export default PortalToolbar;