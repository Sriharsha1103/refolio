import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Box,
  Paper,
  Collapse,
} from "@mui/material";
import { IconFilter, IconTrash, IconPlus, IconX } from "@tabler/icons-react";
import { Publication } from "../../Service/keyValueMap";

const operators = [
  { value: "contains", label: "contains" },
  { value: "equals", label: "equals" },
  { value: "startsWith", label: "starts with" },
  { value: "endsWith", label: "ends with" },
];

const PublicationsFilters = ({
  filters,
  handleFilterChange,
  handleSelectFilterChange,
  jobs,
  authorsList,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null); // Ref for clicking outside detection
  const [rows, setRows] = useState([
    { id: Date.now(), field: "", operator: "contains", value: "" },
  ]);

  // Ref for debouncing text inputs
  const debounceTimeout = useRef(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const columns = [
    { field: "title", label: Publication.title, type: "text" },
    { field: "branch", label: Publication.branch, type: "text" },
    { field: "username", label: Publication.username, type: "text" },
    { field: "cjb", label: Publication.cjb, type: "select", options: jobs },
    { field: "year", label: Publication.year, type: "number" },
    { field: "nationality", label: Publication.nationality, type: "text" },
    { field: "scl", label: Publication.scl, type: "text" },
    {
      field: "author_no",
      label: Publication.author_no,
      type: "select",
      options: authorsList,
    },
  ];

  const handleToggle = () => setOpen(!open);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), field: "", operator: "contains", value: "" },
    ]);
  };

  const handleRemoveRow = (id) => {
    const rowToRemove = rows.find((r) => r.id === id);
    if (rowToRemove && rowToRemove.field) {
      handleFilterChange(rowToRemove.field, "");
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowChange = (id, key, newValue) => {
    let currentField = "";

    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [key]: newValue };

        // If field changed, reset value and operator
        if (key === "field") {
          updatedRow.value = "";
          updatedRow.operator = "contains";
          // Clear previous field filter if it existed
          if (row.field) {
            handleFilterChange(row.field, "");
          }
        }
        currentField = updatedRow.field;
        return updatedRow;
      }
      return row;
    });

    setRows(updatedRows);

    // Sync logic
    if (key === "value" && currentField) {
      const colDef = columns.find((c) => c.field === currentField);

      if (colDef?.type === "select") {
        handleSelectFilterChange(currentField, newValue);
      } else {
        // Debounce text inputs
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
          handleFilterChange(currentField, newValue);
        }, 500); // 500ms delay
      }
    }
  };

  const activeCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div style={{ marginBottom: "16px" }}
    //  ref={containerRef}
     >
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Collapse in={open} sx={{ width: "80%" }}>
          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 2, backgroundColor: "#fafafa", borderRadius: 2, boxShadow: 3 }}
          >
            {rows.map((row) => (
              <Grid
                container
                spacing={2}
                key={row.id}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Column</InputLabel>
                    <Select
                      value={row.field}
                      label="Column"
                      onChange={(e) =>
                        handleRowChange(row.id, "field", e.target.value)
                      }
                    >
                      {columns.map((col) => (
                        <MenuItem key={col.field} value={col.field}>
                          {col.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={row.operator}
                      label="Operator"
                      onChange={(e) =>
                        handleRowChange(row.id, "operator", e.target.value)
                      }
                    >
                      {operators.map((op) => (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  {(() => {
                    const colDef = columns.find((c) => c.field === row.field);
                    if (colDef?.type === "select") {
                      return (
                        <FormControl fullWidth size="small">
                          <InputLabel>Value</InputLabel>
                          <Select
                            value={row.value}
                            label="Value"
                            onChange={(e) =>
                              handleRowChange(row.id, "value", e.target.value)
                            }
                            disabled={!row.field}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {colDef.options.map((opt) => (
                              <MenuItem value={opt} key={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    }
                    return (
                      <TextField
                        fullWidth
                        size="small"
                        label="Value"
                        value={row.value}
                        onChange={(e) =>
                          handleRowChange(row.id, "value", e.target.value)
                        }
                        disabled={!row.field}
                      />
                    );
                  })()}
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton
                    onClick={() => handleRemoveRow(row.id)}
                    color="error"
                  >
                    <IconTrash size={20} />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              startIcon={<IconPlus size={18} />}
              onClick={handleAddRow}
              size="small"
            >
              Add Filter
            </Button>
          </Paper>
        </Collapse>
        <Button
          variant={activeCount > 0 || open ? "none" : "outlined"}
          color="primary"
          startIcon={open ? <IconX /> : <IconFilter />}
          onClick={handleToggle}
          sx={{ textTransform: "none", height: 40, color: 'primary' }}
        >
        {open ? "Close Filters" : `Filters ${activeCount > 0 ? `(${activeCount})` : ''}`}
                </Button>
      </Box>
    </div>
  );
};

export default PublicationsFilters;
