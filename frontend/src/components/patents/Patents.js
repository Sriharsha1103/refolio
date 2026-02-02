import { useEffect, useReducer, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/http";
// import AdvancedSearch from "../CustomComponents/AdvancedSearch";
import { Tab } from "../../store/Actions";
import EntityDataGrid from "../CustomComponents/EntityDataGrid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";

// --- Columns Config ---
const fieldConfigs = [
    { field: "title", width: 250 },
    { field: "pat_no", width: 150 },
    { field: "authors", width: 210 },
    { field: "dept", width: 160 },
    { field: "design_utility", width: 140 },
    { field: "filed", width: 120, isDate: true },
    { field: "published", width: 120, isDate: true },
    { field: "year", width: 120, isDate: true },
    { field: "abstract", width: 420 },
    { field: "country", width: 140 },
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
        dept: "",
        authors: "",
        design_utility: "ALL",
        pat_no: "",
        country: "",
        startDate: null,
        endDate: null,
    },
    patentNumbers: [],
    alert: false,
    alertData: "",
    alertType: "",
};

// --- Helpers ---
const filterData = (data, filters) => {
    return data.filter((item) => {
        const includes = (val, f) => (!f ? true : String(val || "").toLowerCase().includes(f.toLowerCase()));

        if (!includes(item.title, filters.title)) return false;
        if (!includes(item.authors, filters.authors)) return false;
        if (!includes(item.dept, filters.dept)) return false; // dept will be string-joined
        if (!includes(item.pat_no, filters.pat_no)) return false;
        if (!includes(item.country, filters.country)) return false;

        if (filters.design_utility !== "ALL" && item.design_utility !== filters.design_utility) return false;

        if (filters.startDate && filters.endDate) {
            const grant = item.year ? new Date(item.year) : null;
            if (!grant || grant < filters.startDate || grant > filters.endDate) return false;
        }

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
        case "REMOVE_ROW": {
            const newAll = state.allData.filter((d) => d._id !== action.id);
            const newFiltered = filterData(newAll, state.filters);
            const totalPages = state.perPage === 0 ? 1 : Math.ceil(newFiltered.length / state.perPage);
            const nextPage = Math.min(state.pageNo, totalPages || 1);
            return {
                ...state,
                allData: newAll,
                filteredData: newFiltered,
                pageData: totalPages,
                pageNo: nextPage,
                data: paginateData(newFiltered, nextPage, state.perPage),
            };
        }
        case "SET_PATENT_NUMBERS":
            return { ...state, patentNumbers: action.numbers || [] };
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
        case "SET_ALERT":
            return {
                ...state,
                alert: action.payload.alert,
                alertData: action.payload.alertData || state.alertData,
                alertType: action.payload.alertType || state.alertType,
            };
        default:
            return state;
    }
};

function Patents() {
    const service = useMemo(() => new Service(), []);
    const navigate = useNavigate();
    const dispatchRedux = useDispatch();

    const verify = useSelector((state) => state.verify);
    const loggedIn = useSelector((state) => state.logged);
    const isAdmin = useSelector((state) => state.isAdmin);
    const isSuperAdmin = useSelector((state) => state.isSuperAdmin);

    const [state, localDispatch] = useReducer(reducer, initialState);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const setAlert = (val) => localDispatch({ type: "SET_ALERT", payload: { alert: val } });

    // const handleClose = () => localDispatch({ type: "SET_MODAL", value: false });
    // const handleSearch = () => {
    //     if (state.filters.startDate && state.filters.endDate) {
    //         localDispatch({ type: "APPLY_FILTERS" });
    //         localDispatch({ type: "SET_MODAL", value: false });
    //     } else {
    //         localDispatch({ type: "SET_REQUIRED", value: true });
    //     }
    // };
    // const onStartDate = (date) => localDispatch({ type: "SET_FILTER", field: "startDate", value: date });
    // const onEndDate = (date) => localDispatch({ type: "SET_FILTER", field: "endDate", value: date });

    const handleDelete = (row) => {
        setRowToDelete(row);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!rowToDelete) return;
        service
            .delete("api/patents/data/" + rowToDelete._id)
            .then(() => {
                localDispatch({ type: "REMOVE_ROW", id: rowToDelete._id });
                localDispatch({
                    type: "SET_ALERT",
                    payload: { alert: true, alertData: "Successfully Deleted " + rowToDelete.title + " Patent.", alertType: "success" },
                });
                setConfirmOpen(false);
                setRowToDelete(null);
            })
            .catch((err) => {
                console.error("ERROR", err);
                localDispatch({
                    type: "SET_ALERT",
                    payload: { alert: true, alertData: "Error while deleting the patent", alertType: "error" },
                });
                setConfirmOpen(false);
            });
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
        setRowToDelete(null);
    };

    useEffect(() => {
        dispatchRedux(Tab("patent"));
        if (!loggedIn) {
            navigate("../");
            if (!verify) navigate("../verify");
            return;
        }

        // Fetch patents list
        setIsLoading(true);
        service
            .get("api/patents/data")
            .then((json) => {
                const docs = json.docs || json || [];
                // Normalize dept from array to CSV string for filtering/display
                const normalized = docs.map((d) => ({
                    ...d,
                    dept: Array.isArray(d.dept) ? d.dept.join(", ") : d.dept,
                }));
                localDispatch({ type: "SET_ALL_DATA", payload: { docs: normalized } });
                setIsLoading(false);
            })
            .catch((error) => {
                localDispatch({
                    type: "SET_ALERT",
                    payload: { alert: true, alertData: "Error while fetching patents.\n Please try again later.", alertType: "error" },
                });
                console.error(error);
                setIsLoading(false);
            });

        // Fetch patent numbers for duplicate validation
        service
            .get("api/patents/number")
            .then((res) => localDispatch({ type: "SET_PATENT_NUMBERS", numbers: res }))
            .catch((error) => console.error("ERROR", error));
    }, [dispatchRedux, loggedIn, navigate, service, verify]);

    if (!loggedIn) return null;

    return (
        <>
            <CustomSnackbar alert={state.alert} alertData={state.alertData} alertType={state.alertType} setAlert={setAlert} />
            {/* <AdvancedSearch
                show={state.showModal}
                onHide={handleClose}
                startDate={state.filters.startDate}
                endDate={state.filters.endDate}
                onStartDateChange={onStartDate}
                onEndDateChange={onEndDate}
                onSearch={handleSearch}
                required={state.required}
            /> */}

            <div
                className="p-3"
                style={{
                    height: state.data.length > 0 && state.data.length < 10 ? "90vh" : "100%",
                    width: "99vw",
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
                    type={"PatentsKey"}
                    renderEdit={(row) => (
                        <Tooltip title="Edit" placement="top">
                            <IconButton
                                aria-label="edit-patent"
                                onClick={() => {
                                    navigate("/insertPatents", { state: { edit: row } });
                                    console.log("Edited Row", row)
                                }}
                                size="small"
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    loading={isLoading}
                />
                <CustomConfirmDialog
                    open={confirmOpen}
                    handleClose={handleCloseConfirm}
                    handleConfirm={handleConfirmDelete}
                    title="Confirm Delete"
                    content={`This action will permanently delete ${rowToDelete ? rowToDelete.title : "this"} patent.`}
                />
            </div>
        </>
    );
}

export default Patents;