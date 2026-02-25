    import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

import FileUploadSection from "../CustomComponents/FileUploadSection";
import { primaryColor, white } from "../../utils/colors";
import { typeOptions, designationOptions, designationOptionsIT } from "../../utils/constants";
import { toDateInputValue } from "../../utils/dateUtils";

export default function ExperienceAddDialog({
  open,
  onClose,
  todayISO,
  getFieldLabel,
  branch,
  onAdd,
  handleFileChange,
  onFileError,
}) {
  const TYPE_OPTIONS = useMemo(() => typeOptions, []);
  const emptyDraft = useMemo(
    () => ({
      type: "",
      typeOther: "",
      organisation: "",
      designation: "",
      fromDate: "",
      toDate: "",
      currentlyWorking: false,
      experienceFile: null,
    }),
    []
  );

  const [draftExp, setDraftExp] = useState(emptyDraft);

  const getDesignationOptionsByType = (t) => {
    if (t === "Industry") return designationOptionsIT;
    if (t === "Academics") return designationOptions;
    return designationOptions;
  };

  const handleOpen = () => setDraftExp(emptyDraft);

  const handleAdd = () => {
    const normalizedType =
      draftExp.type === "Others"
        ? (draftExp.typeOther || "").trim()
        : (draftExp.type || "").trim();

    const valid =
      !!draftExp.type?.trim() &&
      !(draftExp.type === "Others" && !normalizedType) &&
      !!draftExp.organisation?.trim() &&
      !!draftExp.designation?.trim() &&
      !!draftExp.fromDate &&
      (draftExp.currentlyWorking || !!draftExp.toDate) &&
      !!draftExp.experienceFile;

    if (!valid) return;
    onAdd(draftExp, normalizedType);
  };

  return (
    <Dialog
      open={open}
      onClose={(_e, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      onTransitionEnter={handleOpen}
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
          {/* ...same modal fields as your current file... */}
          <Grid item xs={12} sm={6}>
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
                  setDraftExp((p) => ({ ...p, typeOther: e.target.value }))
                }
                sx={{ mt: 1 }}
              />
            ) : null}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="standard"
              label={getFieldLabel("organisation")}
              required
              value={draftExp.organisation || ""}
              onChange={(e) =>
                setDraftExp((p) => ({ ...p, organisation: e.target.value }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              variant="standard"
              label={getFieldLabel("designation")}
              required
              value={draftExp.designation || ""}
              onChange={(e) =>
                setDraftExp((p) => ({ ...p, designation: e.target.value }))
              }
            >
              {getDesignationOptionsByType(draftExp.type).map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="standard"
              type="date"
              InputLabelProps={{ shrink: true }}
              label={getFieldLabel("fromDate")}
              required
              value={toDateInputValue(draftExp.fromDate)}
              inputProps={{ max: todayISO }}
              onChange={(e) => {
                const nextFrom = e.target.value;
                setDraftExp((p) => {
                  const currTo = toDateInputValue(p.toDate);
                  const shouldClearTo = currTo && nextFrom && nextFrom > currTo;
                  return {
                    ...p,
                    fromDate: nextFrom,
                    toDate: shouldClearTo ? "" : p.toDate,
                  };
                });
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="standard"
              type="date"
              InputLabelProps={{ shrink: true }}
              label={getFieldLabel("toDate")}
              required={!draftExp.currentlyWorking}
              value={toDateInputValue(draftExp.toDate)}
              inputProps={{
                max: todayISO,
                min: toDateInputValue(draftExp.fromDate) || undefined,
              }}
              disabled={!!draftExp.currentlyWorking}
              onChange={(e) => {
                const nextTo = e.target.value;
                setDraftExp((p) => {
                  if (p.currentlyWorking) return p;
                  const currFrom = toDateInputValue(p.fromDate);
                  if (currFrom && nextTo && nextTo < currFrom) return p;
                  return { ...p, toDate: nextTo };
                });
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "flex-end" }}>
            <FormControlLabel
              label="Currently working"
              control={
                <Checkbox
                  checked={!!draftExp.currentlyWorking}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setDraftExp((p) => ({
                      ...p,
                      currentlyWorking: checked,
                      toDate: checked ? "" : p.toDate,
                    }));
                  }}
                />
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FileUploadSection
              file={draftExp.experienceFile}
              branch={branch}
              error={false}
              handleFileChange={(e) => {
                const file = e.target.files?.[0] || null;
                setDraftExp((p) => ({ ...p, experienceFile: file }));
                if (file) handleFileChange(file, "experienceFile", branch);
              }}
              onError={onFileError}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={handleAdd} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
