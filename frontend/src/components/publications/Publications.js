import  { useEffect, useReducer, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Service from "../../Service/http";
import AdvancedSearch from "../CustomComponents/AdvancedSearch";
import { Tab } from "../../store/Actions";
import EntityDataGrid from "../CustomComponents/EntityDataGrid";
import Publication from "./Publication";

// --- Constants & Config ---

const fieldConfigs = [
  { field: "title", width: 250, stickyLeft: 60 },
  { field: "branch", width: 120 },
  { field: "username", width: 210 },
  { field: "cjb", width: 150 },
  { field: "name_cjb", width: 210 },
  { field: "vol", width: 100 },
  { field: "issue", width: 100 },
  { field: "year", width: 100, isDate: true },
  { field: "month", width: 120 },
  { field: "doi", width: 140 },
  { field: "nationality", width: 140 },
  { field: "organised_by", width: 150 },
  { field: "is_proceeding", width: 120 },
  { field: "is_published", width: 120 },
  { field: "scl", width: 120 },
  { field: "citation_scopus", width: 120 },
  { field: "citation_google", width: 120 },
  { field: "link", width: 210, isLink: true },
  { field: "is_affilated", width: 120 },
  { field: "author_no", width: 120 },
  { field: "starting_page", width: 150, headerName: "Page Number", isPageRange: true },
  { field: "cite", width: 420 },
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
    branch: "",
    username: "",
    cjb: "ALL",
    year: "",
    nationality: "",
    scl: "",
    author_no: "",
    startDate: "",
    endDate: "",
  },
};

// --- Helpers ---
const filterData = (data, filters) => {
  return data.filter((item) => {
    const checkRegex = (val, filterVal) => {
      if (!filterVal) return true;
      return String(val || "").toLowerCase().includes(filterVal.toLowerCase());
    };

    if (!checkRegex(item.title, filters.title)) return false;
    if (!checkRegex(item.branch, filters.branch)) return false;
    if (!checkRegex(item.username, filters.username)) return false;
    if (!checkRegex(item.nationality, filters.nationality)) return false;
    if (!checkRegex(item.scl, filters.scl)) return false;

    if (filters.cjb !== "ALL" && item.cjb !== filters.cjb) return false;

    if (filters.year) {
      const itemYear = new Date(item.year).getFullYear().toString();
      if (!itemYear.includes(filters.year)) return false;
    }

    if (filters.author_no !== "ALL" && filters.author_no !== "" && item.author_no !== filters.author_no)
      return false;

    if (filters.startDate && filters.endDate) {
      const date = new Date(item.year);
      if (date < filters.startDate || date > filters.endDate) return false;
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

function Publications() {
  const service = useMemo(() => new Service(), []);
  const navigate = useNavigate();
  const dispatchRedux = useDispatch();

  const verify = useSelector((state) => state.verify);
  const loggedIn = useSelector((state) => state.logged);
  const isAdmin = useSelector((state) => state.isAdmin);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);

  const [state, localDispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  // --- Handlers ---
  const handleClose = () => localDispatch({ type: "SET_MODAL", value: false });

  const handleSearch = () => {
    if (state.filters.startDate && state.filters.endDate) {
      localDispatch({ type: "APPLY_FILTERS", isDateSearch: true });
      localDispatch({ type: "SET_MODAL", value: false });
    } else {
      localDispatch({ type: "SET_REQUIRED", value: true });
    }
  };

  const handleStartDateChange = (date) => localDispatch({ type: "SET_FILTER", field: "startDate", value: date });
  const handleEndDateChange = (date) => localDispatch({ type: "SET_FILTER", field: "endDate", value: date });

  const handleDelete = (data) => {
    if (window.confirm("This action will permenently delete " + data.title + " publication.")) {
      service
        .delete("api/publications/data/" + data._id)
        .then(() => {
          window.alert("Successfully Deleted " + data.title + " Publication.");
          window.location.reload();
        })
        .catch((err) => {
          console.error("ERROR", err);
          window.alert("Error while deleting the publication");
        });
    }
  };

  useEffect(() => {
    dispatchRedux(Tab("publication"));
    if (!loggedIn) {
      navigate("../");
      if (!verify) navigate("../verify");
      return;
    }

    setIsLoading(true);
    service.get(`api/publications/data`)
      .then((json) => {
        localDispatch({ type: "SET_ALL_DATA", payload: json });
        setIsLoading(false);
      })
      .catch((error) => {
        window.alert("Error while fetching the publications.\n Please try again later.");
        console.error(error);
        setIsLoading(false);
      });
  }, [dispatchRedux, loggedIn, navigate, service, verify]);

  if (!loggedIn) return null;

  return (
    <>
      <AdvancedSearch
        show={state.showModal}
        onHide={handleClose}
        startDate={state.filters.startDate}
        endDate={state.filters.endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onSearch={handleSearch}
        required={state.required}
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
          type={"Publication"}
          handleEdit={ (data) => navigate("/insertPublications", { state: { editData: data } }) }
          renderEdit={row => <Publication editData={row} />}
          loading={isLoading}
        />
      </div>
    </>
  );
}

export default Publications;
