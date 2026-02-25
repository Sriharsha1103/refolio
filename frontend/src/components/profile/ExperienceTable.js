import { useEffect, useMemo, useState } from "react";
import {
    Box,
  Checkbox,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { PanelIconButton } from "../CustomComponents/PanelButton";
import { errorColor, primaryColor, white } from "../../utils/colors";
import { typeOptions, designationOptions, designationOptionsIT } from "../../utils/constants";
import { toDateInputValue } from "../../utils/dateUtils";

export default function ExperienceTable({
  body,
  errors,
  dispatchReducer,
  getFieldLabel,
  todayISO,
}) {
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const safeBranch = body?.branch || "common";

  const TYPE_OPTIONS = useMemo(() => typeOptions, []);
  const [dirtyRows, setDirtyRows] = useState({});
  const [originalRows, setOriginalRows] = useState({}); // { [index]: { ...expRow } }

  const EXPERIENCE_FIELDS = useMemo(
    () => [
      "type",
      "organisation",
      "designation",
      "fromDate",
      "toDate",
      "currentlyWorking",
      "experienceFile",
    ],
    []
  );

  const cloneRowForSnapshot = (row) => ({
    type: row?.type ?? "",
    organisation: row?.organisation ?? "",
    designation: row?.designation ?? "",
    fromDate: row?.fromDate ?? "",
    toDate: row?.toDate ?? "",
    currentlyWorking: !!row?.currentlyWorking,
    experienceFile: row?.experienceFile ?? null,
  });

  const markDirty = (index) => setDirtyRows((p) => ({ ...p, [index]: true }));
  const markSaved = (index) => {
    setDirtyRows((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setOriginalRows((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const ensureSnapshot = (index, row) => {
    setOriginalRows((prev) =>
      prev[index] ? prev : { ...prev, [index]: cloneRowForSnapshot(row) }
    );
  };

  const cancelRowChanges = (index) => {
    const snapshot = originalRows[index];
    if (!snapshot) return;

    EXPERIENCE_FIELDS.forEach((field) => {
      const value = snapshot[field];
      dispatchReducer({
        type: "UPDATE_EXP",
        index,
        field,
        value,
      });
    });

    // safety: if snapshot says currently working, keep toDate cleared
    if (snapshot.currentlyWorking) {
      dispatchReducer({
        type: "UPDATE_EXP",
        index,
        field: "toDate",
        value: "",
      });
    }

    setDirtyRows((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setOriginalRows((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  useEffect(() => {
    setDirtyRows((prev) => {
      const next = {};
      Object.keys(prev || {}).forEach((k) => {
        const idx = Number(k);
        if (!Number.isNaN(idx) && idx < (body.Experience || []).length) next[idx] = true;
      });
      return next;
    });

    setOriginalRows((prev) => {
      const next = {};
      Object.keys(prev || {}).forEach((k) => {
        const idx = Number(k);
        if (!Number.isNaN(idx) && idx < (body.Experience || []).length) next[idx] = prev[idx];
      });
      return next;
    });
  }, [body.Experience?.length]);

  const getDesignationOptionsByType = (t) => {
    if (t === "Industry") return designationOptionsIT;
    if (t === "Academics") return designationOptions;
    return designationOptions;
  };

  const tableSx = {
    "& .MuiTableCell-root": {
      color: white,
      borderColor: "rgba(255,255,255,0.10)",
      py: 0.75,
      px: 1,
    },
    "& .MuiTableCell-head": {
      fontWeight: 700,
      letterSpacing: 0.2,
      backgroundColor: "rgba(0,0,0,0.12)",
      backdropFilter: "blur(2px)",
    },
    "& .MuiTableRow-root:nth-of-type(even) td": {
      backgroundColor: "rgba(255,255,255,0.04)",
    },
    "& .MuiInputBase-root": { fontSize: 13, color: white },
    "& .MuiInput-underline:before": { borderBottomColor: "rgba(255,255,255,0.25)" },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "rgba(255,255,255,0.45) !important",
    },
    "& .MuiInput-underline:after": { borderBottomColor: "rgba(255,255,255,0.7)" },
    "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
  };

  const compactCellFieldSx = { "& .MuiFormHelperText-root": { display: "none" } };

  const renderFileChip = (file) => {
    const label = file instanceof File ? file.name : file ? "Uploaded" : "—";
    return (
      <Chip
        size="small"
        label={label}
        variant="outlined"
        sx={{
          maxWidth: 220,
          color: white,
          borderColor: "rgba(255,255,255,0.35)",
          backgroundColor: "rgba(0,0,0,0.08)",
          "& .MuiChip-label": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            maxWidth: "100%",
          },
        }}
        onClick={() => {
          if (!file) return;
          if (typeof file === "string") {
            window.open(`${backendURL}/uploads/${safeBranch}/${file}`, "_blank", "noopener,noreferrer");
            return;
          }
          if (file instanceof File) {
            const url = URL.createObjectURL(file);
            window.open(url, "_blank", "noopener,noreferrer");
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }
        }}
      />
    );
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 2,
      }}
    >
      <Table stickyHeader size="small" sx={tableSx}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 140 }}>{getFieldLabel("type")}</TableCell>
            <TableCell sx={{ width: 180 }}>{getFieldLabel("organisation")}</TableCell>
            <TableCell sx={{ width: 170 }}>{getFieldLabel("designation")}</TableCell>
            <TableCell sx={{ width: 140 }}>{getFieldLabel("fromDate")}</TableCell>
            <TableCell sx={{ width: 140 }}>{getFieldLabel("toDate")}</TableCell>
            <TableCell sx={{ width: 220 }}>File</TableCell>
            <TableCell sx={{ width: 140 }}>Currently working</TableCell>
            <TableCell sx={{ width: 96 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(body.Experience || []).map((ex, i) => {
            const isPresetType = TYPE_OPTIONS.some((o) => o.value === ex.type);
            const typeSelectValue = isPresetType ? ex.type : ex.type ? "Others" : "";
            const typeOtherValue = !isPresetType ? ex.type || "" : "";
            const designationOpts = getDesignationOptionsByType(typeSelectValue);

            return (
              <TableRow key={`exp-row-${i}`} hover>
                <TableCell>
                  <TextField
                    fullWidth
                    select
                    variant="standard"
                    placeholder={getFieldLabel("type")}
                    required
                    error={!!errors?.exp?.[i]?.type}
                    value={typeSelectValue}
                    onChange={(e) => {
                      ensureSnapshot(i, ex);
                      markDirty(i);
                      const next = e.target.value;

                      dispatchReducer({
                        type: "UPDATE_EXP",
                        index: i,
                        field: "type",
                        value: next === "Others" ? typeOtherValue : next,
                      });
                    }}
                    sx={compactCellFieldSx}
                  >
                    {TYPE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {typeSelectValue === "Others" ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Other type"
                      required
                      value={typeOtherValue}
                      onChange={(e) => {
                        ensureSnapshot(i, ex);
                        markDirty(i);
                        dispatchReducer({
                          type: "UPDATE_EXP",
                          index: i,
                          field: "type",
                          value: e.target.value,
                        });
                      }}
                      sx={{ ...compactCellFieldSx, mt: 1 }}
                    />
                  ) : null}
                </TableCell>

                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder={getFieldLabel("organisation")}
                    required
                    error={!!errors?.exp?.[i]?.organisation}
                    value={ex.organisation || ""}
                    onChange={(e) => {
                      ensureSnapshot(i, ex);
                      markDirty(i);
                      dispatchReducer({
                        type: "UPDATE_EXP",
                        index: i,
                        field: "organisation",
                        value: e.target.value,
                      });
                    }}
                    sx={compactCellFieldSx}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    fullWidth
                    select
                    variant="standard"
                    required
                    error={!!errors?.exp?.[i]?.designation}
                    value={ex.designation || ""}
                    onChange={(e) => {
                      ensureSnapshot(i, ex);
                      markDirty(i);
                      dispatchReducer({
                        type: "UPDATE_EXP",
                        index: i,
                        field: "designation",
                        value: e.target.value,
                      });
                    }}
                    sx={compactCellFieldSx}
                  >
                    {designationOpts.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>

                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!!errors?.exp?.[i]?.fromDate}
                    value={toDateInputValue(ex.fromDate)}
                    inputProps={{ max: todayISO }}
                    onChange={(e) => {
                      ensureSnapshot(i, ex);
                      markDirty(i);
                      const nextFrom = e.target.value;
                      const currTo = toDateInputValue(ex.toDate);

                      dispatchReducer({ type: "UPDATE_EXP", index: i, field: "fromDate", value: nextFrom });

                      if (currTo && nextFrom && nextFrom > currTo) {
                        dispatchReducer({ type: "UPDATE_EXP", index: i, field: "toDate", value: "" });
                      }
                    }}
                    sx={compactCellFieldSx}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    required={!ex.currentlyWorking}
                    error={!ex.currentlyWorking && !!errors?.exp?.[i]?.toDate}
                    value={toDateInputValue(ex.toDate)}
                    inputProps={{
                      max: todayISO,
                      min: toDateInputValue(ex.fromDate) || undefined,
                    }}
                    disabled={!!ex.currentlyWorking}
                    onChange={(e) => {
                      ensureSnapshot(i, ex);
                      markDirty(i);
                      const nextTo = e.target.value;
                      const currFrom = toDateInputValue(ex.fromDate);

                      if (ex.currentlyWorking) return;
                      if (currFrom && nextTo && nextTo < currFrom) return;

                      dispatchReducer({ type: "UPDATE_EXP", index: i, field: "toDate", value: nextTo });
                    }}
                    sx={compactCellFieldSx}
                  />
                </TableCell>

                <TableCell>{renderFileChip(ex.experienceFile)}</TableCell>

                <TableCell>
                  <Checkbox
                    checked={!!ex.currentlyWorking}
                    onChange={(e) => {
                      ensureSnapshot(i, ex);
                      markDirty(i);
                      const checked = e.target.checked;

                      dispatchReducer({
                        type: "UPDATE_EXP",
                        index: i,
                        field: "currentlyWorking",
                        value: checked,
                      });

                      if (checked) {
                        dispatchReducer({ type: "UPDATE_EXP", index: i, field: "toDate", value: "" });
                      }
                    }}
                    inputProps={{ "aria-label": "currently working" }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Stack direction="column" spacing={0.5} alignItems="flex-end">
                    {dirtyRows[i] ? (
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Save row" arrow>
                          <PanelIconButton
                            panel="green"
                            aria-label="Save experience row"
                            onClick={() => markSaved(i)}
                            sx={{ width: 34, height: 34 }}
                          >
                            <SaveRoundedIcon
                              fontSize="small"
                              sx={{
                                color: `${primaryColor} !important`,
                                "&:hover": { color: errorColor },
                              }}
                            />
                          </PanelIconButton>
                        </Tooltip>

                        <Tooltip title="Cancel changes" arrow>
                          <PanelIconButton
                            panel="green"
                            aria-label="Cancel experience changes"
                            onClick={() => cancelRowChanges(i)}
                            sx={{ width: 34, height: 34 }}
                          >
                            <CloseRoundedIcon
                              fontSize="small"
                              sx={{
                                color: `${primaryColor} !important`,
                                "&:hover": { color: errorColor },
                              }}
                            />
                          </PanelIconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Tooltip title="Delete experience" arrow>
                        <PanelIconButton
                          panel="green"
                          aria-label="Delete experience"
                          onClick={() => dispatchReducer({ type: "REMOVE_EXP", index: i })}
                          sx={{ width: 34, height: 34 }}
                        >
                          <DeleteOutlineIcon
                            fontSize="small"
                            sx={{
                              color: `${primaryColor} !important`,
                              "&:hover": { color: errorColor },
                            }}
                          />
                        </PanelIconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
