import React, { useEffect, useMemo, useState } from "react";
import { Tooltip, Zoom } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomDataGrid from "./CustomDataGrid";
import {
  PatentsKey,
  Publication,
  ResearchKey,
  UsersKey,
  ConsultancyKey,
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



const EntityDataGrid = ({
  data,
  pageNo,
  perPage,
  handleDelete,
  handleEdit,
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

  useEffect(() => {
    if (type === "Publication") setTableType(Publication);
    if (type === "User") setTableType(UsersKey);
    if (type === "PatentsKey") setTableType(PatentsKey);
    if (type === "ResearchKey") setTableType(ResearchKey);
    if (type === "ConsultancyKey") setTableType(ConsultancyKey);
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

      return {
        field: cfg.field,
        headerName: tableType[cfg.field],
        width: cfg.width || 150,
        renderCell,
        filterable: true,
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
        headerName: "Edit / Delete",
        width: 120,
        sortable: false,
        renderCell: (params) =>
          isAdmin || isSuperAdmin ? (
            <div
              style={{
                background: "#8CAB3D",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tooltip title="Edit" arrow TransitionComponent={Zoom}>
                <EditIcon
                  style={{ fontSize: 22, cursor: "pointer", marginLeft: 8, color: "black" }}
                  onClick={() => handleEdit(params.row)}
                />
              </Tooltip>
              <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
                <DeleteIcon
                  style={{ fontSize: 22, cursor: "pointer", marginLeft: 8, color: "#ff1744" }}
                  onClick={() => handleDelete(params.row)}
                />
              </Tooltip>
            </div>
          ) : null,
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
      addPath={
        type === "Publication"
          ? "/insertPublications"
          : type === "PatentsKey"
          ? "/insertPatents"
          : type === "ResearchKey"
          ? "/insertResearch"
          : type === "ConsultancyKey"
          ? "/insertConsultancy"
          : undefined
      }
      loading={loading}
      loadingMessage={`Loading ${type || 'data'}...`}
    />
  );
};

export default EntityDataGrid;
