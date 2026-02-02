import { useEffect, useMemo, useReducer, useState } from "react";
import Service from "../../Service/http";
import HomeNavbar from "../RNavbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ResearchExportCSV } from "./ResearchExportCSV";
import EditResearch from "./EditResearch";
import EntityDataGrid from "../CustomComponents/EntityDataGrid";
import { Tab } from "../../store/Actions";
import CustomSnackbar from "../CustomComponents/CustomSnackbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const fieldConfigs = [
  { field: "title", width: 250 },
  { field: "pi", width: 150 },
  { field: "co_pi", width: 210 },
  { field: "dept", width: 120 },
  { field: "amount", width: 140 },
  { field: "scheme", width: 160 },
  { field: "year", width: 120 },
  { field: "duration", width: 120 },
];

const initialState = {
  allData: [],
  data: [],
  pageNo: 1,
  perPage: 10,
  color: "",
  background: "#81C784",
  textColor: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ALL_DATA": {
      const docs = action.payload.docs || [];
      return { ...state, allData: docs, data: docs };
    }
    case "REMOVE_ITEM": {
      const id = action.id;
      const allData = state.allData.filter((d) => d._id !== id);
      const data = state.data.filter((d) => d._id !== id);
      return { ...state, allData, data };
    }
    default:
      return state;
  }
};

function Research() {
  const service = useMemo(() => new Service(), []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verify = useSelector((state) => state.verify);
  const loggedIn = useSelector((state) => state.logged);
  const isAdmin = useSelector((state) => state.isAdmin);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);

  const [titles, setTitles] = useState([]);
  const [state, localDispatch] = useReducer(reducer, initialState);
  const [snack, setSnack] = useState({ open: false, status: 0, message: "" });

  const handleDelete = (data) => {
    if (window.confirm("This action will permenently delete " + data.title + " research project.")) {
      service
        .delete("api/research/data/" + data._id)
        .then(() => {
          localDispatch({ type: "REMOVE_ITEM", id: data._id });
          setSnack({ open: true, status: 200, message: `Deleted ${data.title} research project.` });
        })
        .catch((err) => {
          console.error("ERROR", err);
          setSnack({ open: true, status: 500, message: "Error while deleting the research project" });
        });
    }
  };

  useEffect(() => {
    dispatch(Tab("research"));
    if (!loggedIn) {
      navigate("../");
      if (!verify) navigate("../verify");
      return;
    }

    if (titles.length === 0) {
      service
        .get("api/research/titles")
        .then((res) => setTitles(res))
        .catch((error) => {
          console.error("ERROR", error);
          setSnack({ open: true, status: 500, message: "Failed to load research titles" });
        });
    }

    service
      .get("api/research/data")
      .then((json) => {
        const normalized = (json.docs || []).map((d) => ({
          ...d,
          dept: Array.isArray(d.dept) ? d.dept.join(", ") : d.dept,
        }));
        localDispatch({ type: "SET_ALL_DATA", payload: { docs: normalized } });
      })
      .catch((error) => {
        console.error(error);
        setSnack({ open: true, status: 500, message: "Error while fetching research projects" });
      });
  }, [dispatch, loggedIn, navigate, service, titles.length, verify]);

  if (!loggedIn) return null;

  return (
    <>
      {/* <HomeNavbar /> */}
      <div
        className="p-3"
        style={{
          height: state.data.length > 0 && state.data.length < 10 ? "90vh" : "100%",
          width: "99vw",
          backgroundColor: "#c5d299",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <ResearchExportCSV csvData={state.data} fileName={"Research"} />
          </Stack>
        </Box>

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
          type={"ResearchKey"}
          renderEdit={(row) => <EditResearch edit={row} titles={titles} />}
        />
      </div>
      <CustomSnackbar
        open={snack.open}
        status={snack.status}
        message={snack.message}
        handleClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </>
  );
}

export default Research;