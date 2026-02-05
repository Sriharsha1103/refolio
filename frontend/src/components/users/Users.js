import { useEffect, useReducer, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Service from "../../Service/http";
import EntityDataGrid from "../CustomComponents/EntityDataGrid";
import { Tab } from "../../store/Actions";
import CustomConfirmDialog from "../CustomComponents/CustomConfirmDialog";

// --- Constants & Config ---

const fieldConfigs = [
  { field: "Name", width: 250, stickyLeft: 60 },
  { field: "Email", width: 250 },
  { field: "branch", width: 150 },
  { field: "role", width: 150 },
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
    Name: "",
    branch: "",
    role: "ALL",
  },
};

// --- Helpers ---
const filterData = (data, filters) => {
  return data.filter((item) => {
    const checkRegex = (val, filterVal) => {
      if (!filterVal) return true;
      return String(val || "").toLowerCase().includes(filterVal.toLowerCase());
    };

    if (!checkRegex(item.Name, filters.Name)) return false;
    if (!checkRegex(item.branch, filters.branch)) return false;

    if (filters.role !== "ALL" && item.role !== filters.role) return false;

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
      const allDocs = action.payload.docs;
      return {
        ...state,
        allData: allDocs,
        filteredData: allDocs,
        data: paginateData(allDocs, 1, state.perPage),
        pageData: Math.ceil(allDocs.length / state.perPage),
      };
    }
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

function Users() {
  const service = useMemo(() => new Service(), []);
  const navigate = useNavigate();
  const dispatchRedux = useDispatch();

  const verify = useSelector((state) => state.verify);
  const loggedIn = useSelector((state) => state.logged);
  const isAdmin = useSelector((state) => state.isAdmin);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);

  const [state, localDispatch] = useReducer(reducer, initialState);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // --- Handlers ---
  const handleDelete = (data) => {
    setDeleteTarget(data);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    service
      .delete("api/users/record/" + deleteTarget._id)
      .then(() => {
        handleConfirmClose();
        window.alert("Successfully Deleted " + deleteTarget.Name + " User.");
        window.location.reload();
      })
      .catch((err) => {
        console.error("ERROR", err);
        handleConfirmClose();
        window.alert("Error while deleting the User");
      });
  };

  useEffect(() => {
    dispatchRedux(Tab("users"));
    if (!loggedIn) {
      navigate("../");
      if (!verify) navigate("../verify");
      return;
    }

    service.get("api/users/list?limit=0")
      .then((json) => {
        localDispatch({ type: "SET_ALL_DATA", payload: json });
      })
      .catch((error) => {
        window.alert("Error while fetching the users.\n Please try again later.");
        console.error(error);
      });
  }, [dispatchRedux, loggedIn, navigate, service, verify]);

  if (!loggedIn) return null;

  return (
    <>
      <CustomConfirmDialog
        open={confirmOpen}
        handleClose={handleConfirmClose}
        handleConfirm={handleConfirmDelete}
        title="Confirm Delete"
        content={
          deleteTarget
            ? "This action will permenently delete " + deleteTarget.Name + " User."
            : ""
        }
      />
      <div
        className="p-3"
        style={{
          height: state.data.length > 0 && state.data.length < 10 ? "90vh" : "100%",
          width: "99vw",
          backgroundColor: "#c5d299",
        }}
      >
        <EntityDataGrid
          data={state.filteredData}
          // pageNo={state.pageNo}
          perPage={state.perPage}
          handleDelete={handleDelete}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
          color={state.color}
          background={state.background}
          textColor={state.textColor}
          fieldConfigs={fieldConfigs}
          type={"User"}
        />
      </div>
    </>
  );
}

export default Users;
