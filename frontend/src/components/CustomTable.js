import React from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Box, Toolbar } from "@mui/material";

const CustomTable = ({ data, columns, pageSize, loading, getRowId }) => {
  const CustomToolBar = () => {
    return (
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
        <Toolbar>
          <GridToolbarFilterButton title="Custom Toolbar" />
        </Toolbar>
        <Toolbar>
          <GridToolbarColumnsButton />
        </Toolbar>
        <Toolbar>
          <GridToolbarExport />
        </Toolbar>
      </Box>
    );
  };
  return (
    <Box sx={{ height: "75vh", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize || 25,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        loading={loading}
        getRowId={getRowId || ((row) => row._id || row.id || Math.random())}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "14px",
            outline: "none !important",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
        slots={{
          toolbar: CustomToolBar,
        }}
      />
    </Box>
  );
};

export default CustomTable;
