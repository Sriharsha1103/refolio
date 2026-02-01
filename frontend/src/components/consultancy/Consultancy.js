import { useEffect, useMemo, useReducer, useState } from "react";
import Service from "../../Service/http";
import HomeNavbar from "../RNavbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ConsultancyExportCSV } from "./ConsultancyExportCSV";
import EditConsultancy from "./EditConsultancy";
import EntityDataGrid from "../CustomComponents/EntityDataGrid";
import { Tab } from "../login/Actions";

const fieldConfigs = [
  { field: "title", width: 250 },
  { field: "pi", width: 150 },
  { field: "co_pi", width: 210 },
  { field: "dept", width: 120 },
  { field: "industry", width: 160 },
  { field: "ngo", width: 140 },
  { field: "amount", width: 140 },
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
    default:
      return state;
  }
};

function Consultancy() {
  const service = useMemo(() => new Service(), []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verify = useSelector((state) => state.verify);
  const loggedIn = useSelector((state) => state.logged);
  const isAdmin = useSelector((state) => state.isAdmin);
  const isSuperAdmin = useSelector((state) => state.isSuperAdmin);

  const [titles, setTitles] = useState([]);
  const [state, localDispatch] = useReducer(reducer, initialState);

  const handleDelete = (data) => {
    if (window.confirm("This action will permenently delete " + data.title + " consultancy project.")) {
      service
        .delete("api/consultancy/data/" + data._id)
        .then(() => {
          window.alert("Successfully Deleted " + data.title + " consultancy project.");
          window.location.reload();
        })
        .catch((err) => {
          console.error("ERROR", err);
          window.alert("Error while deleting the consultancy project");
        });
    }
  };

  useEffect(() => {
    dispatch(Tab("consultancy"));
    if (!loggedIn) {
      navigate("../");
      if (!verify) navigate("../verify");
      return;
    }

    if (titles.length === 0) {
      service
        .get("api/consultancy/titles")
        .then((res) => setTitles(res))
        .catch((error) => console.error("ERROR", error));
    }

    service
      .get("api/consultancy/data")
      .then((json) => {
        const normalized = (json.docs || []).map((d) => ({
          ...d,
          dept: Array.isArray(d.dept) ? d.dept.join(", ") : d.dept,
        }));
        localDispatch({ type: "SET_ALL_DATA", payload: { docs: normalized } });
      })
      .catch((error) => {
        window.alert("Error while fetching consultancy projects.\n Please try again later.");
        console.error(error);
      });
  }, [dispatch, loggedIn, navigate, service, titles.length, verify]);

  if (!loggedIn) return null;

  return (
    <>
      <HomeNavbar />
      <div
        className="p-3"
        style={{
          height: state.data.length > 0 && state.data.length < 10 ? "90vh" : "100%",
          width: "99vw",
          backgroundColor: "#c5d299",
        }}
      >
        <MDBRow>
          <MDBCol md="4">
            <ConsultancyExportCSV csvData={state.data} fileName={"Consultancy"} />
          </MDBCol>
          <MDBCol md="8" />
        </MDBRow>

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
          type={"ConsultancyKey"}
          renderEdit={(row) => <EditConsultancy edit={row} titles={titles} />}
        />
      </div>
    </>
  );
}

export default Consultancy;