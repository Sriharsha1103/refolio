import React, { useEffect, useMemo, useState } from "react";
import { Tooltip, Zoom } from "@mui/material";
import { IconTrash } from "@tabler/icons-react";
import HelpModal from "../publications/HelpModal";
import EditPatent from "../patents/EditPatent";
import CustomDataGrid from "./CustomDataGrid";
import {
  PatentsKey,
  Publication,
  ResearchKey,
  UsersKey,
  ConsultancyKey,
} from "../../Service/keyValueMap";
import { getCJBLabel, getMonthName } from "../../utils/helper";

const yearOnly = (value) => (value ? new Date(value).getFullYear() : "");

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

const bgColors = ["#A6BE87", "#C3D496", "#F0F7E6"];

const EntityDataGrid = ({
  data,
  pageNo,
  perPage,
  handleDelete,
  isAdmin,
  isSuperAdmin,
  color,
  background,
  textColor,
  fieldConfigs,
  type,
  freezeCount = 2,
  renderEdit,
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
      const bg = bgColors[i % bgColors.length];
      const cellProps = { bg, color, background, textColor };

      let renderCell = (params) => (
        <CustomCell row={params.row} {...cellProps}>
          {params.value}
        </CustomCell>
      );

      if (cfg.isDate) {
        renderCell = (p) => (
          <CustomCell row={p.row} {...cellProps}>
            {yearOnly(p.value)}
          </CustomCell>
        );
      }

      if (cfg.field === "month") {
        renderCell = (p) => (
          <CustomCell row={p.row} {...cellProps}>
            {getMonthName(p.value)}
          </CustomCell>
        );
      }

      if (cfg.field === "cjb") {
        renderCell = (p) => (
          <CustomCell row={p.row} {...cellProps}>
            {getCJBLabel(p.value)}
          </CustomCell>
        );
      }

      return {
        field: cfg.field,
        headerName: tableType[cfg.field],
        width: cfg.width || 150,
        renderCell,
        filterable: true,
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
              {renderEdit ? renderEdit(params.row) : <HelpModal edit={params.row} />}
              <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
                <IconTrash
                  size={22}
                  color="white"
                  style={{ cursor: "pointer", marginLeft: 8 }}
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
    color,
    background,
    textColor,
    renderEdit,
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
    />
  );
};

export default EntityDataGrid;
