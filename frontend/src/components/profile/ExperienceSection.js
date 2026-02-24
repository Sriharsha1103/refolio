import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileUploadSection from "../CustomComponents/FileUploadSection";
import { PanelIconButton } from "../CustomComponents/PanelButton";
import { black, errorColor, primaryColor, white } from "../../utils/colors";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Stack, Chip } from "@mui/material";
import {
  typeOptions,
  designationOptions,
  designationOptionsIT,
} from "../../utils/constants";

function ExperienceSection({
  body,
  dispatchReducer,
  errors,
  rightGroupSx,
  getFieldLabel,
  handleFileChange,
  onFileError,
}) {
  const toDateInputValue = (value) => {
    if (!value) return "";

    if (value instanceof Date) {
      const t = value.getTime();
      if (Number.isNaN(t)) return "";
      return value.toISOString().slice(0, 10);
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
      if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return trimmed.slice(0, 10);
      }

      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime()))
        return parsed.toISOString().slice(0, 10);
      return "";
    }

    return "";
  };

  const TYPE_OPTIONS = useMemo(() => typeOptions, []);

  const emptyDraft = useMemo(
    () => ({
      type: "",
      typeOther: "",
      organisation: "",
      designation: "",
      fromDate: "",
      toDate: "",
      experienceFile: null,
    }),
    []
  );

  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const safeBranch = body?.branch || "common";

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draftExp, setDraftExp] = useState(emptyDraft);
  const [dirtyRows, setDirtyRows] = useState({});

  const markDirty = (index) =>
    setDirtyRows((prev) => ({ ...prev, [index]: true }));

  const markSaved = (index) =>
    setDirtyRows((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });

  useEffect(() => {
    setDirtyRows((prev) => {
      const next = {};
      Object.keys(prev || {}).forEach((k) => {
        const idx = Number(k);
        if (!Number.isNaN(idx) && idx < (body.Experience || []).length)
          next[idx] = true;
      });
      return next;
    });
  }, [body.Experience?.length]);

  const openAddModal = () => {
    setDraftExp(emptyDraft);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleAddModalClose = (_event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    closeAddModal();
  };

  const addDraftToList = () => {
    const normalizedType =
      draftExp.type === "Others"
        ? (draftExp.typeOther || "").trim()
        : (draftExp.type || "").trim();

    if (
      !draftExp.type?.trim() ||
      (draftExp.type === "Others" && !normalizedType) ||
      !draftExp.organisation?.trim() ||
      !draftExp.designation?.trim() ||
      !draftExp.fromDate ||
      !draftExp.toDate ||
      !draftExp.experienceFile
    ) {
      return;
    }

    const nextIndex = (body.Experience || []).length;

    dispatchReducer({ type: "ADD_EXP" });

    Object.entries(draftExp).forEach(([field, value]) => {
      dispatchReducer({
        type: "UPDATE_EXP",
        index: nextIndex,
        field,
        value,
      });
    });

    dispatchReducer({
      type: "UPDATE_EXP",
      index: nextIndex,
      field: "type",
      value: normalizedType,
    });

    closeAddModal();
  };

  const getDesignationOptionsByType = (t) => {
    if (t === "Industry") return designationOptionsIT;
    if (t === "Academics") return designationOptions;
    return designationOptions; // fallback for Others/empty
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
    "& .MuiInputBase-root": {
      fontSize: 13,
      color: white,
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "rgba(255,255,255,0.25)",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "rgba(255,255,255,0.45) !important",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "rgba(255,255,255,0.7)",
    },
    "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
  };

  const compactCellFieldSx = {
    "& .MuiFormHelperText-root": { display: "none" },
  };

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
            window.open(
              `${backendURL}/uploads/${safeBranch}/${file}`,
              "_blank",
              "noopener,noreferrer"
            );
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
    <Box sx={rightGroupSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          mb: 1,
          color: white,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: white, textAlign: "center", width: "100%" }}
        >
          Experience
        </Typography>
        <Tooltip title="Add experience" arrow>
          <PanelIconButton
            panel="green"
            aria-label="Add experience"
            onClick={openAddModal}
            sx={{ position: "absolute", right: 0 }}
          >
            <AddRoundedIcon />
          </PanelIconButton>
        </Tooltip>
      </Box>

      <Dialog
        open={isAddModalOpen}
        onClose={handleAddModalClose}
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: white,
            color: primaryColor,
            padding: 4,
            borderRadius: 3,
          },
        }}
        BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.3)" } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Add Experience</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            {["type", "organisation", "designation", "fromDate", "toDate"].map(
              (f) => (
                <Grid item xs={12} sm={6} key={f}>
                  {f === "type" ? (
                    <>
                      <TextField
                        fullWidth
                        select
                        variant="standard"
                        label={getFieldLabel("type")}
                        required
                        value={draftExp.type || ""}
                        onChange={(e) => {
                          const next = e.target.value;
                          setDraftExp((p) => ({
                            ...p,
                            type: next,
                            typeOther: next === "Others" ? p.typeOther : "",
                          }));
                        }}
                      >
                        {TYPE_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>

                      {draftExp.type === "Others" ? (
                        <TextField
                          fullWidth
                          variant="standard"
                          label="Other type"
                          required
                          value={draftExp.typeOther || ""}
                          onChange={(e) =>
                            setDraftExp((p) => ({
                              ...p,
                              typeOther: e.target.value,
                            }))
                          }
                          sx={{ mt: 1 }}
                        />
                      ) : null}
                    </>
                  ) : f === "designation" ? (
                    <TextField
                      fullWidth
                      select
                      variant="standard"
                      label={getFieldLabel(f)}
                      required
                      value={draftExp[f] || ""}
                      onChange={(e) => {
                        setDraftExp((p) => ({
                          ...p,
                          [f]: e.target.value,
                        }));
                      }}
                    >
                      {getDesignationOptionsByType(draftExp.type).map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      variant="standard"
                      type={f.includes("Date") ? "date" : "text"}
                      InputLabelProps={{ shrink: true }}
                      label={getFieldLabel(f)}
                      required
                      value={
                        f.includes("Date")
                          ? toDateInputValue(draftExp[f])
                          : draftExp[f] || ""
                      }
                      onChange={(e) =>
                        setDraftExp((p) => ({
                          ...p,
                          [f]: e.target.value,
                        }))
                      }
                    />
                  )}
                </Grid>
              )
            )}

            <Grid item xs={12}>
              <FileUploadSection
                file={draftExp.experienceFile}
                branch={body.branch}
                error={false}
                handleFileChange={(e) => {
                  setDraftExp((p) => ({
                    ...p,
                    experienceFile: e.target.files[0],
                  }));
                  handleFileChange(
                    e.target.files[0],
                    "experienceFile",
                    body.branch
                  );
                }}
                onError={onFileError}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddModal} variant="text">
            Cancel
          </Button>
          <Button onClick={addDraftToList} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          "Teaching_Experience",
          "Research_Experience",
          "Industry_Experience",
        ].map((f) => (
          <Grid item xs={4} sm={3} key={f}>
            <TextField
              fullWidth
              variant="standard"
              label={getFieldLabel(f)}
              required
              error={!!errors?.main?.[f]}
              helperText={errors?.main?.[f] ? "Required" : ""}
              value={body[f] || ""}
              onChange={(e) =>
                dispatchReducer({
                  type: "SET_FIELD",
                  field: f,
                  value: e.target.value,
                })
              }
              sx={{
                "& .MuiInputBase-input": { color: white },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.85)" },
                "& .MuiInputLabel-root.Mui-focused": { color: white },
                "& .MuiFormHelperText-root": { color: white },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "rgba(255,255,255,0.25)",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "rgba(255,255,255,0.45) !important",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "rgba(255,255,255,0.7)",
                },
                "& .MuiFormLabel-root.Mui-error": { color: errorColor },
                "& .MuiInputBase-root.Mui-error:after": {
                  borderBottomColor: errorColor,
                },
                "& .MuiFormHelperText-root.Mui-error": { color: errorColor },
              }}
            />
          </Grid>
        ))}
      </Grid>

      {body.Experience.length > 0 && (
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
                <TableCell sx={{ width: 140 }}>
                  {getFieldLabel("type")}
                </TableCell>
                <TableCell sx={{ width: 180 }}>
                  {getFieldLabel("organisation")}
                </TableCell>
                <TableCell sx={{ width: 170 }}>
                  {getFieldLabel("designation")}
                </TableCell>
                <TableCell sx={{ width: 140 }}>
                  {getFieldLabel("fromDate")}
                </TableCell>
                <TableCell sx={{ width: 140 }}>
                  {getFieldLabel("toDate")}
                </TableCell>
                <TableCell sx={{ width: 220 }}>File</TableCell>
                <TableCell sx={{ width: 96 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(body.Experience || []).map((ex, i) => {
                const isPresetType = TYPE_OPTIONS.some(
                  (o) => o.value === ex.type
                );
                const typeSelectValue = isPresetType
                  ? ex.type
                  : ex.type
                  ? "Others"
                  : "";
                const typeOtherValue = !isPresetType ? ex.type || "" : "";
                const designationOpts =
                  getDesignationOptionsByType(typeSelectValue);

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
                          markDirty(i);
                          const next = e.target.value;

                          if (next === "Others") {
                            dispatchReducer({
                              type: "UPDATE_EXP",
                              index: i,
                              field: "type",
                              value: typeOtherValue,
                            });
                          } else {
                            dispatchReducer({
                              type: "UPDATE_EXP",
                              index: i,
                              field: "type",
                              value: next,
                            });
                          }
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
                        onChange={(e) => {
                          markDirty(i);
                          dispatchReducer({
                            type: "UPDATE_EXP",
                            index: i,
                            field: "fromDate",
                            value: e.target.value,
                          });
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
                        required
                        error={!!errors?.exp?.[i]?.toDate}
                        value={toDateInputValue(ex.toDate)}
                        onChange={(e) => {
                          markDirty(i);
                          dispatchReducer({
                            type: "UPDATE_EXP",
                            index: i,
                            field: "toDate",
                            value: e.target.value,
                          });
                        }}
                        sx={compactCellFieldSx}
                      />
                    </TableCell>

                    <TableCell>{renderFileChip(ex.experienceFile)}</TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="column"
                        spacing={0.5}
                        alignItems="flex-end"
                      >
                        {dirtyRows[i] ? (
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
                        ) : (
                          <Tooltip title="Delete experience" arrow>
                            <PanelIconButton
                              panel="green"
                              aria-label="Delete experience"
                              onClick={() =>
                                dispatchReducer({
                                  type: "REMOVE_EXP",
                                  index: i,
                                })
                              }
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
      )}
    </Box>
  );
}

export default ExperienceSection;
