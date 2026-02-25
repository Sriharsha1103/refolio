import { Box, Grid, TextField, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { PanelIconButton } from "../CustomComponents/PanelButton";
import { errorColor, white } from "../../utils/colors";
import { useEffect, useMemo, useState } from "react";

import ExperienceAddDialog from "./ExperienceAddDialog";
import ExperienceTable from "./ExperienceTable";
import {
  getTodayISO,
  monthsBetweenISO,
  formatYearsFromMonths,
} from "../../utils/dateUtils";

function ExperienceSection({
  body,
  dispatchReducer,
  errors,
  rightGroupSx,
  getFieldLabel,
  handleFileChange,
  onFileError,
}) {
  const todayISO = useMemo(() => getTodayISO(), []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const handleAdd = (draftExp, normalizedType) => {
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

  useEffect(() => {
    const rows = body?.Experience || [];
    let industryMonths = 0;
    let academicsMonths = 0;

    rows.forEach((ex) => {
      const type = (ex?.type || "").trim();
      if (type !== "Industry" && type !== "Academics") return;

      const from = ex?.fromDate;
      const to = ex?.currentlyWorking ? todayISO : ex?.toDate;
      const months = monthsBetweenISO(from, to);
      if (!months) return;

      if (type === "Industry") industryMonths += months;
      if (type === "Academics") academicsMonths += months;
    });

    const nextIndustry = formatYearsFromMonths(industryMonths);
    const nextTeaching = formatYearsFromMonths(academicsMonths);

    // only dispatch if changed to avoid loops
    if ((body?.Industry_Experience || "") !== nextIndustry) {
      dispatchReducer({
        type: "SET_FIELD",
        field: "Industry_Experience",
        value: nextIndustry,
      });
    }

    // Map Academics -> Teaching_Experience (per prompt)
    if ((body?.Teaching_Experience || "") !== nextTeaching) {
      dispatchReducer({
        type: "SET_FIELD",
        field: "Teaching_Experience",
        value: nextTeaching,
      });
    }
  }, [body?.Experience, body?.Industry_Experience, body?.Teaching_Experience, dispatchReducer, todayISO]);

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

      <ExperienceAddDialog
        open={isAddModalOpen}
        onClose={closeAddModal}
        todayISO={todayISO}
        getFieldLabel={getFieldLabel}
        branch={body.branch}
        onAdd={handleAdd}
        handleFileChange={handleFileChange}
        onFileError={onFileError}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {["Teaching_Experience", "Research_Experience", "Industry_Experience"].map(
          (f) => (
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
          )
        )}
      </Grid>

      {!!(body.Experience || []).length && (
        <ExperienceTable
          body={body}
          errors={errors}
          dispatchReducer={dispatchReducer}
          getFieldLabel={getFieldLabel}
          todayISO={todayISO}
        />
      )}
    </Box>
  );
}

export default ExperienceSection;
