import React, { useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate, useLocation } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Button, Typography } from "@mui/material";
import Service from "../../Service/http";
import { Departments, PatentsKey } from "../../Service/keyValueMap";
import { useDispatch, useSelector } from "react-redux";
import { Tab } from "../../store/Actions";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import { primary, primaryColor, primaryHover, white } from "../../utils/colors";
import { BulkUpload } from "./BulkUpload";

function Patent() {
  const formatDateForInput = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.logged);
  const verify = useSelector((state) => state.verify);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);
  const isAdmin = useSelector((state) => state.isAdmin);
  const service = useMemo(() => new Service(), []);

  const formRef = React.useRef();
  const location = useLocation();
  const editData = location.state?.edit || null;
  const isEdit = !!editData;

  const [body, setBody] = useState(() => {
    if (editData) {
      const normalizedDept = Array.isArray(editData.dept)
        ? editData.dept
        : typeof editData.dept === "string"
        ? editData.dept
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      return {
        ...editData,
        dept: normalizedDept,
        filed: formatDateForInput(editData.filed),
        published: formatDateForInput(editData.published),
        year: formatDateForInput(editData.year),
      };
    }
    return {
      authors: "",
      dept: [],
      pat_no: "",
      title: "",
      filed: "",
      abstract: "",
      design_utility: "",
      published: "",
      year: "",
      country: "",
    };
  });
  const [originalPatNo, setOriginalPatNo] = useState(() =>
    editData ? parseInt(editData.pat_no, 10) : null
  );

  const [titles, setTitles] = useState([]);
  const [send, setSend] = useState(0);
  const [errors, setErrors] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    status: 0,
    message: "",
  });

  const navigate = useNavigate();

  const showSnackbar = (status, message) => {
    setSnackbar({ open: true, status, message });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    showSnackbar(400, "Cancelled the insert action.");
  };

  const handleConfirmSubmit = () => {
    setConfirmDialogOpen(false);
    if (isEdit) {
      service
        .post("api/patents/update", body)
        .then(() => {
          showSnackbar(200, "Updated " + body.title + " Patent.");
          setTimeout(() => navigate("/patents"), 1000);
        })
        .catch((error) => {
          console.log(error);
          showSnackbar(
            500,
            "Error while updating " + body.title + ". Please try again later."
          );
        });
    } else {
      service
        .post("api/patents/data", body)
        .then(() => {
          showSnackbar(200, "Successfully Added " + body.title);
          setTimeout(() => navigate("/patents"), 1000);
        })
        .catch((error) => {
          console.log(error);
          showSnackbar(
            500,
            "Error while adding " + body.title + ". Please try again later."
          );
        });
    }
  };

  const handleFieldChange = (e) => {
    const { name, id } = e.target;
    const key = name || id;
    let value = e.target.value;

    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }

    setBody((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const mandatory = [
      { id: "title", name: PatentsKey.title, value: body.title },
      { id: "authors", name: PatentsKey.authors, value: body.authors },
      { id: "pat_no", name: PatentsKey.pat_no, value: body.pat_no },
      {
        id: "dept",
        name: PatentsKey.dept,
        value: body.dept && body.dept.length > 0,
      },
      {
        id: "design_utility",
        name: PatentsKey.design_utility,
        value: body.design_utility,
      },
      { id: "filed", name: PatentsKey.filed, value: body.filed },
      { id: "country", name: PatentsKey.country, value: body.country },
    ];

    const newErrors = {};
    const missing = [];
    mandatory.forEach((f) => {
      if (!f.value || (Array.isArray(f.value) && f.value.length === 0)) {
        newErrors[f.id] = true;
        missing.push(f.name);
      }
    });

    // Duplicate patent number check
    const patNoNum = body.pat_no !== "" ? parseInt(body.pat_no, 10) : NaN;
    const isDuplicate =
      patNoNum &&
      titles.includes(patNoNum) &&
      (!isEdit || patNoNum !== originalPatNo);
    if (isDuplicate) {
      newErrors["pat_no"] = true;
      showSnackbar(409, "Patent Number already exists");
    }

    setErrors(newErrors);

    if (missing.length > 0) {
      showSnackbar(400, `Missing mandatory fields: ${missing.join(", ")}`);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      setConfirmDialogOpen(true);
    }
  };

  useEffect(() => {
    if (isEdit && editData) {
      const normalizedDept = Array.isArray(editData.dept)
        ? editData.dept
        : typeof editData.dept === "string"
        ? editData.dept
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      setBody({
        ...editData,
        dept: normalizedDept,
        filed: formatDateForInput(editData.filed),
        published: formatDateForInput(editData.published),
        year: formatDateForInput(editData.year),
      });
      setOriginalPatNo(parseInt(editData.pat_no, 10));
    }
    dispatch(Tab("new-patent"));
    if (!loggedIn) {
      navigate("../");
    } else if (!verify) {
      navigate("../verify");
    } else if (isSuperAdmin) {
      navigate("../publications");
    }
    if (titles.length === 0) {
      service
        .get("api/patents/number")
        .then((res) => setTitles(res))
        .catch((error) => console.log("ERROR", error));
    }
  }, [
    dispatch,
    isSuperAdmin,
    loggedIn,
    navigate,
    service,
    titles.length,
    verify,
    isEdit,
    editData,
  ]);

  return (
    <>
      <div
        style={{
          height: "88vh",
          width: "100wh",
          backgroundColor: "#c5d299",
          paddingBottom: "150px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth={false}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} sx={{ m: 4 }}>
              {isAdmin ? (
                <Grid container justifyContent="flex-end" sx={{ mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <BulkUpload titles={titles} />
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
              <Card sx={{ borderRadius: "15px" }}>
                <CardContent sx={{ p: "0px !important" }}>
                  <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ p: { xs: 2, md: 5 }, bgcolor: white }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ mb: 4, color: primaryColor }}
                        >
                          Patent Information
                        </Typography>
                        <TextField
                          required
                          id="title"
                          name="title"
                          label={PatentsKey.title}
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          value={body.title || ""}
                          error={!!errors.title}
                        />
                        <TextField
                          required
                          id="authors"
                          name="authors"
                          label={
                            PatentsKey.authors +
                            ' (Add multiple authors seperated by ",")'
                          }
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          value={body.authors || ""}
                          error={!!errors.authors}
                        />
                        <TextField
                          required
                          id="pat_no"
                          name="pat_no"
                          label={PatentsKey.pat_no}
                          placeholder="Enter a valid Patent Number"
                          fullWidth
                          variant="standard"
                          sx={{ mb: 4 }}
                          type="number"
                          inputProps={{ min: 2000 }}
                          onChange={handleFieldChange}
                          value={body.pat_no || ""}
                          error={!!errors.pat_no}
                        />
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={6}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.dept}
                            >
                              <InputLabel id="dept-label">
                                {PatentsKey.dept + "*"}
                              </InputLabel>
                              <Select
                                labelId="dept-label"
                                id="dept"
                                name="dept"
                                multiple
                                value={body.dept}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setBody((prev) => ({
                                    ...prev,
                                    dept:
                                      typeof value === "string"
                                        ? value.split(",")
                                        : value,
                                  }));
                                  if (errors.dept)
                                    setErrors((prev) => ({
                                      ...prev,
                                      dept: false,
                                    }));
                                }}
                                label={PatentsKey.dept}
                                renderValue={(selected) =>
                                  Array.isArray(selected)
                                    ? selected.join(", ")
                                    : ""
                                }
                                required
                              >
                                {Departments.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl
                              variant="standard"
                              sx={{ minWidth: 120, width: "100%" }}
                              error={!!errors.design_utility}
                            >
                              <InputLabel id="design-util-label">
                                {PatentsKey.design_utility + "*"}
                              </InputLabel>
                              <Select
                                labelId="design-util-label"
                                id="design_utility"
                                name="design_utility"
                                value={body.design_utility || ""}
                                onChange={handleFieldChange}
                                label={PatentsKey.design_utility}
                                required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Design">Design</MenuItem>
                                <MenuItem value="Utility">Utility</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ p: { xs: 2, md: 5 }, bgcolor: primaryColor }}
                      >
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              required
                              id="filed"
                              name="filed"
                              label={PatentsKey.filed}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              onChange={handleFieldChange}
                              value={body.filed || ""}
                              error={!!errors.filed}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              id="published"
                              name="published"
                              label={PatentsKey.published}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              onChange={handleFieldChange}
                              value={body.published || ""}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              id="year"
                              name="year"
                              label={PatentsKey.year}
                              fullWidth
                              variant="standard"
                              color="secondary"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              onChange={handleFieldChange}
                              value={body.year || ""}
                            />
                          </Grid>
                        </Grid>
                        <TextField
                          id="abstract"
                          name="abstract"
                          label={PatentsKey.abstract}
                          fullWidth
                          variant="standard"
                          color="secondary"
                          multiline
                          minRows={3}
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          value={body.abstract || ""}
                        />
                        <TextField
                          required
                          id="country"
                          name="country"
                          label={PatentsKey.country}
                          fullWidth
                          variant="standard"
                          color="secondary"
                          sx={{ mb: 4 }}
                          onChange={handleFieldChange}
                          value={body.country || ""}
                          error={!!errors.country}
                        />
                        <Grid container spacing={2} alignItems="center" justifyContent={"center"} mt={2}>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                              display: "flex",
                              justifyContent: {
                                md: "flex-start",
                                xs: "center",
                              },
                            }}
                          >
                            <Button
                              variant="contained"
                              type="submit"
                              form="insert-data"
                              sx={{
                                backgroundColor: primary,
                                color: primaryColor,
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: primaryHover,
                                  color: white,
                                },
                              }}
                              onClick={() => {
                                formRef.current?.reportValidity();
                                setSend(send + 1);
                              }}
                            >
                              {isEdit ? "Update" : "Submit"}
                            </Button>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                              display: "flex",
                              justifyContent: {
                                md: "flex-end",
                                xs: "center",
                              },
                            }}
                          >
                            <Button
                              variant="outlined"
                              sx={{
                                color: white,
                                borderColor: white,
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: white,
                                  color: primaryColor,
                                  borderColor: white,
                                },
                              }}
                              onClick={() => navigate("/patents")}
                            >
                              Cancel
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
        <CustomSnackbar
          open={snackbar.open}
          handleClose={handleCloseSnackbar}
          status={snackbar.status}
          message={snackbar.message}
        />
        <CustomConfirmDialog
          open={confirmDialogOpen}
          handleClose={handleCloseConfirmDialog}
          handleConfirm={handleConfirmSubmit}
          title="Confirm Submission"
          content="This action will add the data into the Database"
        />
      </div>
    </>
  );
}

export default Patent;
