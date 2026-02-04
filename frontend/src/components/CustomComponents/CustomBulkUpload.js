import React, { useReducer } from "react";
import { Button } from "@mui/material";
import { read, utils } from "xlsx";
import Service from "../../Service/http";
import CustomSnackbar from "./CustomSnackbar";
import CustomConfirmDialog from "./CustomConfirmDialog";
import CustomBulkUploadModal from "./CustomBulkUploadModal";

const service = new Service();

const initialState = {
  showModal: false,
  rows: [],
  snackbar: { open: false, status: 0, message: "" },
  confirmOpen: false,
  uploading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, showModal: true };
    case "CLOSE_MODAL":
      return { ...state, showModal: false };
    case "SET_ROWS":
      return { ...state, rows: action.rows };
    case "SHOW_SNACKBAR":
      return { ...state, snackbar: { open: true, status: action.status, message: action.message } };
    case "HIDE_SNACKBAR":
      return { ...state, snackbar: { ...state.snackbar, open: false } };
    case "OPEN_CONFIRM":
      return { ...state, confirmOpen: true };
    case "CLOSE_CONFIRM":
      return { ...state, confirmOpen: false };
    case "START_UPLOAD":
      return { ...state, uploading: true };
    case "END_UPLOAD":
      return { ...state, uploading: false };
    default:
      return state;
  }
}

/**
 * CustomBulkUpload is a generic bulk upload component that handles:
 * - File import (xlsx/csv) with a fixed column order
 * - Sample header CSV download
 * - Row-level preprocessing and validation
 * - Duplicate checks
 * - POSTing rows to a backend endpoint
 */
const CustomBulkUpload = ({
  titles = [],
  endpoint,
  columnOrder = [], // e.g. ["title", "authors", ...]
  sampleHeaders = {}, // mapping of key -> display header (used in sample row)
  duplicateCheck, // (row, titles) => errorMessage | null
  preprocessRow, // (row) => processedRow
  validateRow, // (row) => errorMessage | null
  sampleFilename = "Sample_Upload_File.csv",
  triggerText = "Bulk Upload",
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const expectedHeaderRow = columnOrder.map((key) => sampleHeaders[key]);

  const handleImport = ($event) => {
    const files = $event.target.files;
    if (!files?.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const wb = read(event.target.result);
      const sheets = wb.SheetNames;
      if (!sheets.length) return;
      let rows = utils.sheet_to_json(wb.Sheets[sheets[0]], {
        defval: "",
        header: columnOrder,
      });

      const firstRow = rows[0] || {};
      const firstRowValues = columnOrder.map((key) => firstRow[key]);
      const isHeaderValid = JSON.stringify(firstRowValues) === JSON.stringify(expectedHeaderRow);
      if (!isHeaderValid) {
        dispatch({ type: "SHOW_SNACKBAR", status: 400, message: "INVALID Excel Format. Check the Sample Excel." });
        return;
      }
      rows = rows.slice(1);
      dispatch({ type: "SET_ROWS", rows });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    const header = expectedHeaderRow;
    const csvRows = [header];
    const csvContent = csvRows
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sampleFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadData = () => {
    dispatch({ type: "OPEN_CONFIRM" });
  };

  const handleConfirmUpload = () => {
    dispatch({ type: "CLOSE_CONFIRM" });
    let valid = true;
    const processed = [];
    for (let i = 0; i < state.rows.length; i++) {
      const originalRow = state.rows[i];
      const row = preprocessRow ? preprocessRow({ ...originalRow }) : { ...originalRow };

      const dupMsg = duplicateCheck ? duplicateCheck(row, titles) : null;
      if (dupMsg) {
        valid = false;
        dispatch({ type: "SHOW_SNACKBAR", status: 409, message: dupMsg });
        break;
      }

      const errMsg = validateRow ? validateRow(row, i) : null;
      if (errMsg) {
        valid = false;
        dispatch({ type: "SHOW_SNACKBAR", status: 400, message: errMsg });
        break;
      }
      processed.push(row);
    }

    if (valid && processed.length) {
      dispatch({ type: "START_UPLOAD" });
      service
        .post(endpoint, processed)
        .then(() => {
          dispatch({ type: "SHOW_SNACKBAR", status: 200, message: "Successfully uploaded the data." });
          dispatch({ type: "CLOSE_MODAL" });
        })
        .catch((err) => {
          console.log("ERROR", err);
          dispatch({ type: "SHOW_SNACKBAR", status: 500, message: "Error while uploading data. Please try again later." });
        })
        .finally(() => dispatch({ type: "END_UPLOAD" }));
    }
  };

  return (
    <>
      <CustomBulkUploadModal
        show={state.showModal}
        onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        onImportFile={handleImport}
        onImportClick={uploadData}
        onDownloadSample={handleDownload}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => dispatch({ type: "OPEN_MODAL" })}
      >
        {triggerText}
      </Button>
      <CustomSnackbar
        open={state.snackbar.open}
        handleClose={() => dispatch({ type: "HIDE_SNACKBAR" })}
        status={state.snackbar.status}
        message={state.snackbar.message}
      />
      <CustomConfirmDialog
        open={state.confirmOpen}
        handleClose={() => {
          dispatch({ type: "CLOSE_CONFIRM" });
          dispatch({ type: "SHOW_SNACKBAR", status: 400, message: "Cancelled the bulk upload action." });
        }}
        handleConfirm={handleConfirmUpload}
        title={"Confirm Bulk Upload"}
        content={"This will upload the data into the Database."}
      />
    </>
  );
};

export default CustomBulkUpload;
