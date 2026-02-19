import { useEffect, useReducer, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/http";
import { Tab } from "../../store/Actions";
import EntityDataGrid from "../CustomComponents/EntityDataGrid";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";
import PdfViewerDialog from "../CustomComponents/PdfViewerDialog";

// --- Columns Config ---
const fieldConfigs = [
    { field: "Name", width: 150 },
    { field: "Designation", width: 100 },
    { field: "College_ID", width: 100 },
    { field: "JNTUH_ID", width: 100 },
    { field: "Fields_of_Specialization", width: 250 },
    { field: "Ratification_status", width: 100 },
    { field: "Teaching_Experience", width: 100 },
    { field: "Research_Experience", width: 100 },
    { field: "Industry_Experience", width: 100 },
    { field: "Scopus_ID", width: 100 },
    { field: "Vidwan_ID", width: 100 },
    { field: "Invited_Talks", width: 100 },
    
];


const initialState = {
    allData: [],
    data: [],
    filteredData: [],
    pageData: 0,
    pageNo: 1,
    perPage: 10,
    showModal: false,
    required: false,
    color: "",
    background: "#81C784",
    textColor: "",
    filters: {
        title: "",
        designation: "",
        collegeid: "",
        startDate: null,
        endDate: null,
    },
    profileNumbers: [],
};

// --- Helpers ---
const filterData = (data, filters) => {
    return data.filter((item) => {
        const includes = (val, f) => (!f ? true : String(val || "").toLowerCase().includes(f.toLowerCase()));

        if (!includes(item.Name, filters.title)) return false;
        if (!includes(item.Designation, filters.designation)) return false;
        if (!includes(item.College_ID, filters.collegeid)) return false;
        if (!includes(item.JNTUH_ID, filters.JNTUHID)) return false;
        if (!includes(item.Fields_of_Specialization, filters.specialization)) return false;
        if (!includes(item.Ratification_status, filters.Ratification_status)) return false;
        if (!includes(item.Teaching_Experience, filters.teaching)) return false;
        if (!includes(item.Research_Experience, filters.research)) return false;
        if (!includes(item.Industry_Experience, filters.industry)) return false;
        if (!includes(item.Scopus_ID, filters.scopusid)) return false;
        if (!includes(item.Vidwan_ID, filters.vidwanid)) return false;
        if (!includes(item.Invited_Talks, filters.invitedtalks)) return false;
        return true;
    });
};

const paginateData = (data, pageNo, perPage) => {
    if (perPage === 0) return data;
    const start = (pageNo - 1) * perPage;
    return data.slice(start, start + parseInt(perPage));
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_ALL_DATA": {
            const allDocs = action.payload.docs || action.payload || [];
            return {
                ...state,
                allData: allDocs,
                filteredData: allDocs,
                data: paginateData(allDocs, 1, state.perPage),
                pageData: Math.ceil(allDocs.length / state.perPage),
            };
        }
        case "SET_PROFILE_NUMBERS":
            return { ...state, profileNumbers: action.numbers || [] };
        case "APPLY_FILTERS": {
            const effectiveFilters = action.newFilters || state.filters;
            const filtered = filterData(state.allData, effectiveFilters);
            const totalPages = state.perPage === 0 ? 1 : Math.ceil(filtered.length / state.perPage);
            return {
                ...state,
                filters: effectiveFilters,
                filteredData: filtered,
                data: paginateData(filtered, 1, state.perPage),
                pageData: totalPages,
                pageNo: 1,
            };
        }
        case "SET_FILTER": {
            const newFilters = { ...state.filters, [action.field]: action.value };
            const filteredSet = filterData(state.allData, newFilters);
            return {
                ...state,
                filters: newFilters,
                filteredData: filteredSet,
                data: paginateData(filteredSet, 1, state.perPage),
                pageData: state.perPage === 0 ? 1 : Math.ceil(filteredSet.length / state.perPage),
                pageNo: 1,
            };
        }
        case "SET_PAGE":
            return {
                ...state,
                pageNo: action.value,
                data: paginateData(state.filteredData, action.value, state.perPage),
            };
        case "SET_PER_PAGE": {
            const newPerPage = parseInt(action.value);
            const newTotalPages = newPerPage === 0 ? 1 : Math.ceil(state.filteredData.length / newPerPage);
            return {
                ...state,
                perPage: newPerPage,
                pageNo: 1,
                pageData: newTotalPages,
                data: paginateData(state.filteredData, 1, newPerPage),
            };
        }
        case "SET_MODAL":
            return { ...state, showModal: action.value };
        case "SET_REQUIRED":
            return { ...state, required: action.value };
        default:
            return state;
    }
};

function Profiles() {
    const service = useMemo(() => new Service(), []);
    const navigate = useNavigate();
    const dispatchRedux = useDispatch();

    const verify = useSelector((state) => state.verify);
    const loggedIn = useSelector((state) => state.logged);
    const isAdmin = useSelector((state) => state.isAdmin);
    const isSuperAdmin = useSelector((state) => state.isSuperAdmin);

    const [state, localDispatch] = useReducer(reducer, initialState);
    const [snack, setSnack] = useState({ open: false, status: 0, message: "" });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [pdfViewer, setPdfViewer] = useState({ open: false, url: "", title: "" });

    const handleClose = () => localDispatch({ type: "SET_MODAL", value: false });
    const handleSearch = () => {
        if (state.filters.startDate && state.filters.endDate) {
            localDispatch({ type: "APPLY_FILTERS" });
            localDispatch({ type: "SET_MODAL", value: false });
        } else {
            localDispatch({ type: "SET_REQUIRED", value: true });
        }
    };
    const onStartDate = (date) => localDispatch({ type: "SET_FILTER", field: "startDate", value: date });
    const onEndDate = (date) => localDispatch({ type: "SET_FILTER", field: "endDate", value: date });

    const handleDelete = (row) => {
        setDeleteTarget(row);
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
        setDeleteTarget(null);
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;

        service
            .delete("api/profile/data/" + deleteTarget._id)
            .then(() => {
                setSnack({
                    open: true,
                    status: 200,
                    message: "Successfully Deleted " + deleteTarget.Name + " Profile.",
                });
                handleConfirmClose();
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch((err) => {
                console.error("ERROR", err);
                setSnack({
                    open: true,
                    status: 500,
                    message: "Error while deleting the patent",
                });
                handleConfirmClose();
            });
    };

    const handleView = (row) => {
    console.log('Row',row)
    if (!row || !row.fileName) {
      setSnack({
        open: true,
        message: "No document Uploaded",
        status: 400,
      });
      return;
    }

    const backendBase = process.env.REACT_APP_BACKEND_URL || "";
    const branch = row.branch || "";
    const fileUrl = `${backendBase}/uploads/${branch}/${row.fileName}`;

    setPdfViewer({
      open: true,
      url: fileUrl,
      title: row.title || "Profiles",
    });
  };

  const handlePdfClose = () => {
    setPdfViewer((prev) => ({ ...prev, open: false }));
  };

    useEffect(() => {
        dispatchRedux(Tab("profiles"));
        if (!loggedIn) {
            navigate("../");
            if (!verify) navigate("../verify");
            return;
        }

        // Fetch patents list
        service
            .get("api/profile/data")
            .then((json) => {
                const docs = json.docs || json || [];
                // Normalize dept from array to CSV string for filtering/display
                const normalized = docs.map((d) => ({
                    ...d,
                    id: d._id
                }));
                localDispatch({ type: "SET_ALL_DATA", payload: { docs: normalized } });
            })
            .catch((error) => {
                setSnack({
                    open: true,
                    status: 500,
                    message: "Error while fetching profile.\n Please try again later.",
                });
                console.error(error);
            });

        // Fetch patent numbers for EditPatent validation
        service
            .get("api/profile/number")
            .then((res) => localDispatch({ type: "SET_PROFILE_NUMBERS", numbers: res }))
            .catch((error) => console.error("ERROR", error));
    }, [dispatchRedux, loggedIn, navigate, service, verify]);

    if (!loggedIn) return null;

    return (
        <>
            <CustomSnackbar
                open={snack.open}
                status={snack.status}
                message={snack.message}
                handleClose={() => setSnack((prev) => ({ ...prev, open: false }))}
            />
            <PdfViewerDialog
                    open={pdfViewer.open}
                    onClose={handlePdfClose}
                    title={pdfViewer.title}
                    fileUrl={pdfViewer.url}
                  />
            <CustomConfirmDialog
                open={confirmOpen}
                handleClose={handleConfirmClose}
                handleConfirm={handleConfirmDelete}
                title="Confirm Delete"
                content={
                    deleteTarget
                        ? "This action will permenently delete " + deleteTarget.Name + " profile."
                        : ""
                }
            />
         

            {/* <HomeNavbar /> */}
            <div
                className="p-3"
                style={{
                    height: "89vh",
                    width: "100vw",
                    backgroundColor: "#c5d299",
                }}
            >
                <EntityDataGrid
                    data={state.data}
                    pageNo={state.pageNo}
                    perPage={state.perPage}
                    handleDelete={handleDelete}
                    isAdmin={isAdmin}
                    isSuperAdmin={isSuperAdmin}
                    color={state.color}
                    background={state.background}
                    textColor={state.textColor}
                    fieldConfigs={fieldConfigs}
                    type={"ProfileKey"}
                    handleEdit={
                        (row) =>
                            navigate("../insertProfile", {
                                state: { edit: true, profileData: row, profileNumbers: state.profileNumbers },
                            })
                    }
                    handleView={handleView}
                />
            </div>
        </>
    );
}

export default Profiles;