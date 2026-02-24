import React, { useEffect, useMemo, useState } from "react";
import { Tooltip, Zoom } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CustomDataGrid from "./CustomDataGrid";
import {
  PatentsKey,
  PublicationsKey,
  ResearchKey,
  UsersKey,
  ConsultancyKey,
  ProfileKey,
  
} from "../../Service/keyValueMap";
import { getCJBLabel, getMonthName } from "../../utils/helper";
import { tableBgColors } from "../../utils/colors";

const yearOnly = (value) => (value ? new Date(value).getFullYear() : "");

/** Format date for CSV export as MM-DD-YYYY */
const formatDateMDY = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};

const CustomCell = ({ row, children, bg, color, background, textColor }) => (
  <div
    style={{
      background: row?.my ? background : bg,
      color: row?.my ? color : textColor,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      paddingLeft: 8,
    }}
  >
    {children}
  </div>
);

// simple header renderer that always shows the filter icon
// and opens the filter panel instead of sorting
const HeaderWithFilter = ({ colDef, api }) => {
  const { headerName, field } = colDef;

  const handleClick = (event) => {
    // prevent header click from triggering default sort
    event.preventDefault();
    event.stopPropagation();
    // open filter panel for this column
    api.showFilterPanel(field);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", width: "auto" }}>
      <span style={{ fontWeight: "bold", marginRight: "20px" }}>
        {headerName}
      </span>
      {
        <FilterAltIcon
          fontSize="small"
          style={{ opacity: 0.8, cursor: "pointer" }}
          onClick={handleClick}
        />
      }
    </div>
  );
};

const EntityDataGrid = ({
  data,
  pageNo,
  perPage,
  handleDelete,
  handleEdit,
  handleView,
  isAdmin,
  isSuperAdmin,
  color,
  background,
  textColor,
  fieldConfigs,
  type,
  freezeCount = 2,
  renderEdit,
  loading,
}) => {
  const [tableType, setTableType] = useState({});
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    if (type === "Publication") setTableType(PublicationsKey);
    if (type === "User") setTableType(UsersKey);
    if (type === "PatentsKey") setTableType(PatentsKey);
    if (type === "ResearchKey") setTableType(ResearchKey);
    if (type === "ConsultancyKey") setTableType(ConsultancyKey);
    if (type === "ProfileKey") setTableType(ProfileKey);
    
  }, [type]);

  const columns = useMemo(() => {
    const generated = fieldConfigs.map((cfg, i) => {
      const bg = tableBgColors[i % tableBgColors.length];
      const cellProps = { bg, color, background, textColor };

      let renderCell = (params) => (
        <CustomCell row={params.row} {...cellProps}>
          {params.value}
        </CustomCell>
      );
      let valueFormatter;

      if (cfg.isDate) {
        renderCell = (p) => (
          <CustomCell row={p.row} {...cellProps}>
            {yearOnly(p.value)}
          </CustomCell>
        );
        // Use full date in CSV export
        valueFormatter = (p) => formatDateMDY(p.value);
      }

      if (cfg.field === "month") {
        renderCell = (p) => (
          <CustomCell row={p.row} {...cellProps}>
            {getMonthName(p.value)}
          </CustomCell>
        );
        valueFormatter = (p) => getMonthName(p.value);
      }

      if (cfg.field === "cjb") {
        renderCell = (p) => (
          <CustomCell row={p.row} {...cellProps}>
            {getCJBLabel(p.value)}
          </CustomCell>
        );
        valueFormatter = (p) => getCJBLabel(p.value);
      }

      const headerTitle = tableType[cfg.field];

      return {
        field: cfg.field,
        headerName: headerTitle,
        width: cfg.width || 150,
        filterable: true,
        // show filter icon by default in header, wired to filter panel
        renderHeader: (params) =>
          gridApi && (isAdmin || isSuperAdmin) ? (
            <HeaderWithFilter colDef={params.colDef} api={gridApi} />
          ) : (
            <span style={{ fontWeight: "bold", marginRight: "20px" }}>
              {headerTitle}
            </span>
          ),
        ...(valueFormatter ? { valueFormatter } : {}),
      };
    });

    return [
      {
        field: "index",
        headerName: "No.",
        width: 60,
        renderCell: (params) => {
          const index = params.api.getAllRowIds().indexOf(params.id);
          return (
            <div
              style={{
                background: "#548C42",
                color: "#fff",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
                fontWeight: 600,
              }}
            >
              {index + 1}
            </div>
          );
        },
      },
      ...generated,
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <div
            style={{
              background: "#8CAB3D",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {
              <Tooltip title="View Details" arrow TransitionComponent={Zoom}>
                <VisibilityIcon
                  style={{
                    fontSize: 22,
                    cursor: "pointer",
                    marginLeft: 8,
                    color: "#616161",
                    "&:hover": { color: "#424242" },
                  }}
                  onClick={() => handleView(params.row)}
                  disabled={!params.row.fileName}
                />
              </Tooltip>
            }
            <>
              <Tooltip title="Edit" arrow TransitionComponent={Zoom}>
                <EditIcon
                  style={{
                    fontSize: 22,
                    cursor: "pointer",
                    marginLeft: 8,
                    color: "#1976D2",
                    "&:hover": { color: "#1565C0" },
                  }}
                  onClick={() => handleEdit(params.row)}
                />
              </Tooltip>
              {(isAdmin || isSuperAdmin) && (
                <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
                  <DeleteIcon
                    style={{
                      fontSize: 22,
                      cursor: "pointer",
                      marginLeft: 8,
                      color: "#D32F2F",
                      "&:hover": { color: "#B71C1C" },
                    }}
                    onClick={() => handleDelete(params.row)}
                  />
                </Tooltip>
              )}
            </>
          </div>
        ),
      },
    ];
  }, [
    fieldConfigs,
    tableType,
    isAdmin,
    isSuperAdmin,
    handleDelete,
    handleEdit,
    color,
    background,
    textColor,
    gridApi,
  ]);

  /** 🔒 Compute frozen columns correctly */
  const pinnedLeft = useMemo(() => {
    let left = 0;
    const frozen = columns.slice(0, freezeCount);

    return frozen.map((col) => {
      const current = { field: col.field, left };
      left += col.width || 150;
      return current;
    });
  }, [columns, freezeCount]);

  return (
    <CustomDataGrid
      data={data}
      columns={columns}
      pageSize={perPage}
      pinnedLeft={pinnedLeft}
      // capture grid api from CustomDataGrid via prop callback
      onGridApiReady={setGridApi}
      addPath={
        type === "Publication"
          ? "/insertPublications"
          : type === "PatentsKey"
          ? "/insertPatents"
          : type === "ResearchKey"
          ? "/insertResearch"
          : type === "ConsultancyKey"
          ? "/insertConsultancy"
          : type === "ProfileKey"
          ? "/insertProfile"
          : undefined
      }
      loading={loading}
      loadingMessage={`Loading ${type || "data"}...`}
    />
  );
};

export default EntityDataGrid;
