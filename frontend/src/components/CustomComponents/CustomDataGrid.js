import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import PortalToolbar  from "./PortalToolBar";
// Removed unused PortalToolbar imports

const CustomDataGrid = ({
  data,
  columns,
  pageSize,
  loading,
  getRowId,
  pinnedLeft = [],
}) => {
  // const FREEZE_COUNT = 2;
  const pinnedSx = pinnedLeft.reduce((acc, col, index) => {
    const zCell = 100 + index;
    const zHeader = 200 + index;

    // BODY CELLS
    acc[`& .MuiDataGrid-cell[data-field="${col.field}"]`] = {
      position: "sticky",
      left: col.left,
      zIndex: zCell,
      background: "#fff",
      boxShadow: "2px 0 0 rgba(0,0,0,0.08)",
    };

    // HEADER CELLS (ACTUAL FIX)
    acc[
      `& .MuiDataGrid-columnHeadersInner .MuiDataGrid-columnHeader[data-field="${col.field}"]`
    ] = {
      position: "sticky",
      left: col.left,
      zIndex: zHeader,
      background: "#f5f5f5",
      boxShadow: "2px 0 0 rgba(0,0,0,0.08)",
    };

    return acc;
  }, {});

  useEffect(() => {
    const grid = document.querySelector(".MuiDataGrid-virtualScroller");
    const header = document.getElementById("frozen-header");

    if (!grid || !header) return;

    const sync = () => {
      header.scrollLeft = grid.scrollLeft;
    };

    grid.addEventListener("scroll", sync);
    return () => grid.removeEventListener("scroll", sync);
  }, []);

  // FrozenHeader component removed (unused)

  return (
    <Box sx={{ height: "75vh", width: "100%" }}>
      {/* <FrozenHeader columns={columns} /> */}
      <Box
        id="external-grid-toolbar"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          px: 1,
          py: 0.5,
          background: "#cddda5",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
        }}
      />
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        columnHeaderHeight={64}
        getRowId={getRowId || ((row) => row._id || row.id)}
        initialState={{
          pagination: { paginationModel: { pageSize: pageSize || 25 } },
          pinnedColumns: {
            left: ["index", "title"],
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{ toolbar: PortalToolbar }}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            overflow: "visible",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            whiteSpace: "normal",
            lineHeight: 1.2,
          },
          "& .MuiDataGrid-cell": {
            fontSize: 14,
            p: 0,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
          "& .MuiDataGrid-columnHeadersInner": {
            overflow: "visible",
          },

          ...pinnedSx,
        }}
        disableRowSelectionOnClick
        disableVirtualization
      />
    </Box>
  );
};

export default CustomDataGrid;
