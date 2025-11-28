import ReactTable from "react-table-6";
import React, { useEffect, useState,  } from "react";
import "react-table-6/react-table.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Service from "../../Service/http";
import HomeNavbar from "../RNavbar";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip, Zoom } from "@mui/material";

import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import {
  IconCheck,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Switch, rem, useMantineTheme } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { UsersKey } from "../../Service/keyValueMap";
import { Tab } from "../login/Actions";

const ReactTableFixedColumns = withFixedColumns(ReactTable);
// const ReactTableFixedColumns = ReactTable;a
function Users() {
  const theme = useMantineTheme();
  const service = new Service();
  const navigate = useNavigate();
  const verify = useSelector((state) => state.verify);
  const loggedIn = useSelector((state) => state.logged);
  const dispatch=useDispatch();
  let [data, setData] = useState([]); /*Table data*/
  let [pageData, setPageData] = useState([]); /*Meta Data about pages*/
  let [color, Setcolor] = useState("");
  let [ID, setID] = useState("");
  let [background, SetBackground] = useState("#81C784");
  let [textColor, SetTextcolor] = useState("");
  let isAdmin = useSelector((state) => state.isAdmin);
  let isSuperAdmin = useSelector((state) => state.isSuperAdmin);

  /*Tells when the api need to be called*/
  let [getApi, setGetApi] = useState(0);

  /*Value of the filter applied*/
  let [publicationFilterValue, setPublicationFilterValue] = useState("");
  let [branchFilterValue, setBranchFilterValue] = useState("");
  let [publishedByFilterValue, setPublishedByFilterValue] = useState("");
  let [c_j_bFilterValue, setc_j_bFilterValue] = useState("ALL");

  let [yearFilterValue, setYearFilterValue] = useState("");

  let [nationalityFilterValue, setNationalityFilterValue] = useState("");
  let [authorsFilterValue, setAuthorsFilterValue] = useState("");

  let [scopusFilterValue, setScopusFilterValue] = useState("");
  let [startDate, setStartDate] = useState("");
  let [endDate, setEndDate] = useState("");
  let [ischecked, setChecked] = useState("");
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  let [jobs, setJobs] = useState(["ALL", "Yes", "No"]);
  let [authors, setAuthors] = useState([
    "ALL",
    "Single",
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Others",
  ]);
  // let [verdicts, setVerdict] = useState(['All',"ACCEPTED", "WRONG ANSWER","TIME LIMIT EXCEEDED","RUNTIME ERROR","PENDING","OTHER","COMPILATION ERROR"]);
  // let [languages, setLanguage] = useState(['All',"CPP", "C#", "JAVA", "JAVASCRIPT", "PYTHON"]);

  /*Pagination Data*/
  let [pageNo, setPageNo] = useState(1);
  let [perPage, setPerPage] = useState(10);
  // let [startMonth, setStartMonth] = useState("");
  // let [startYear, setStartYear] = useState("");
  // let [endMonth, setEndMonth] = useState("");
  // let [endYear, setEndYear] = useState("");
  let [Required, setRequired] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  const handleSearch = () => {
    if (startDate && endDate) {
      setYearFilterValue("");
      setGetApi(getApi + 1);
      setShow(false);
    }
  };

  const handleChange = (event, v) => {
    // console.log(v)
    setPageNo(v);
    setGetApi(getApi + 1);
  };
  const fun = (e) => {
    var isod = new Date(e).toLocaleDateString().split("/");
    return isod[2];
  };
  const handleDelete = (data) => {
    // console.log('data',data);
    let confirm = window.confirm(
      "This action will permenently delete " + data.Name + " User."
    );
    if(confirm){
    service
      .delete("api/users/record/" + data._id)
      .then((res) => {
        // console.log("DELETD",res);
        window.alert("Successfully Deleted " + data.Name + " User.");
        window.location.reload();
      })
      .catch((err) => {
        console.log("ERROR", err);
        window.alert("Error while deleting the User");
      });
    }else{
        window.alert("Cancelled the delete action."); 
      }
  };
  const handleSave = async (data) => {
    // console.log('data',data);
    if (
      (ischecked && data.role == "admin") ||
      (!ischecked && data.role == "user")
    ) {
      window.alert("No changes were made for " + data.Name + ".");
    } else {
        const confirmationMessage = ischecked
    ? "This action will make " + data.Name + " from " + data.branch + " as ADMIN."
    : "This action will make " + data.Name + " from " + data.branch + " as USER.";

  const userConfirmed = window.confirm(confirmationMessage);

  if (userConfirmed) {
    const roleToUpdate = ischecked ? "admin" : "user";

    service
      .post("api/users/role", { _id: data._id, role: roleToUpdate })
      .then((res) => {
        window.alert("Successfully " + data.Name + " has become " + roleToUpdate + ".");
        window.location.reload();
      })
      .catch((err) => {
        console.log("ERROR", err);
        window.alert("Error while updating the user role.");
      });
  } else {
    // User clicked "Cancel"
    window.alert("Role Update canceled.");
    window.location.reload();
  }
}
  };
  const handleClear = () => {
    window.location.reload()
  };
  useEffect(() => {
    dispatch(Tab('users'));
    if (!loggedIn) {
      navigate("../");
      if (!verify) {
        navigate("../verify");
      }
    }

    service
      .get(
        "api/users/list?username=" +
          publicationFilterValue +
          "&branch=" +
          branchFilterValue +
          "&admin=" +
          (authorsFilterValue === "ALL" ? "" : authorsFilterValue) +
          "&page=" +
          pageNo +
          "&limit=" +
          perPage +
          "&registeredDate=" +
          startDate
      )
      .then((json) => {
        console.log("JSON", json);
        setData(json.docs);
        setPageData(json.limit == 0 ? 1 : json.pages);
        // setEndDate("")
        // setEndMonth("")
        // setEndYear("")
        // setStartDate("")
        // setStartMonth("")
        // setStartYear("")
        // setRequired(false)
        // DownloadData.push
        // for(let ele of json.docs){
        //     docs
        // }
      })
      .catch((error) => {
        window.alert(
          "Error while fetching the publications.\n Please try again later."
        );
        console.log(error);
      });
  }, [getApi]);
  // useEffect(()=>{
  //     let admin= localStorage.getItem('isAdmin')
  //     setIsAdmin(admin);
  //     console.log(localStorage.getItem('isAdmin'))
  // },[])

  if (loggedIn) {
    return (
      <>
        <HomeNavbar />
        <div
          className="p-3"
          style={{
            height: 0 < data.length && data.length < 10 ? "90vh" : "100%",
            width: "99vw",
            backgroundColor: "#c5d299",
          }}
        >
          {/* <CSVLink
  data={data}
  filename={"my-file.csv"}
  className="btn btn-primary"
  target="_blank"
>
  Download me
</CSVLink> */}
          <br />
          <MDBRow end>
            {/* <MDBCol md="4">
              <ExportCSV csvData={data} fileName={"Publications"} />
            </MDBCol>
            <MDBCol md="4">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleShow}
              >
                Advance Search
              </Button>
            </MDBCol> */}
            <MDBCol  md="4">
              <Button variant="contained" color="error" onClick={handleClear}>
                Clear Filter
              </Button>
            </MDBCol>
          </MDBRow>
          <br />
          {/* <Button variant="contained" color='secondary' onClick={onDownload}>Download</Button>
<table  ref={tableRef}>
                  <tbody>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Age</th>
                    </tr>
                    <tr>
                        <td>Edison</td>
                        <td>Padilla</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>Alberto</td>
                        <td>Lopez</td>
                        <td>94</td>
                    </tr>
                  </tbody>
                </table> */}

          <ReactTableFixedColumns
            // ref={tableRef}
            sortable={false}
            data={data}
            pageSize={data?.length || perPage}
            showPagination={false}
            columns={[
              {
                Header: "No",
                id: "index",
                accessor: "",
                Cell: (row) => {
                  //   console.log(row)
                  return <div>{(pageNo - 1) * perPage + row.index + 1}</div>;
                },
                // Cell: e =>{},
                getProps: (state, rowInfo, column) => {
                  return {
                    style: {
                      color: rowInfo?.original?.my ? "white" : "white",
                      background:
                        rowInfo?.original?._id === ID ? "#238ad9" : "#548C42",
                    },
                  };
                },
                minWidth: 50,
                fixed: "left",
              },
              {
                Header: () => (
                  <div>
                    {UsersKey.Name}
                    <br />
                    <input
                      type="text"
                      id="publication"
                      name="publication"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setGetApi(getApi + 1);
                          setPageNo(1);
                        }
                      }}
                      onChange={(e) => {
                        setPublicationFilterValue(e.target.value);
                      }}
                    />
                  </div>
                ),
                accessor: "Name",
                disableSortBy: true,
                // Cell: e =>{e.original.title},
                getProps: (state, rowInfo, column) => {
                  return {
                    style: {
                      color: rowInfo?.original?.my ? "white" : "white",
                      background:
                        rowInfo?.original?._id === ID ? "#238ad9" : "#8CAB3D",
                    },
                  };
                },
                minWidth: 237,
                fixed: "left",
              },
              {
                Header: UsersKey.Email,
                accessor: "Email",
                //Cell: e =>{e.original.username},
                getProps: (state, rowInfo, column) => {
                  return {
                    style: {
                      color: rowInfo?.original?.my ? color : textColor,
                      background:
                        rowInfo?.original?._id === ID ? "#238ad9" : "#C3D496",
                    },
                  };
                },
                minWidth: 210,
              },
              {
                Header: () => (
                  <div>
                    {UsersKey.branch}
                    <br />
                    <input
                      size="sm"
                      type="text"
                      id="branch"
                      name="branch"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setGetApi(getApi + 1);
                          setPageNo(1);
                        }
                      }}
                      onChange={(e) => {
                        setBranchFilterValue(e.target.value);
                      }}
                    />
                  </div>
                ),
                accessor: "branch",
                //Cell: e =>{e.original.title},
                getProps: (state, rowInfo, column) => {
                  return {
                    style: {
                      color: rowInfo?.original?.my ? color : textColor,
                      background:
                        rowInfo?.original?._id === ID ? "#238ad9" : "#A6BE87",
                    },
                  };
                },
                minWidth: 100,
              },

              {
                Header: () => (
                  <div>
                    {UsersKey.admin}
                    <br />
                    <select
                      id="admin"
                      onChange={(e) => {
                        setAuthorsFilterValue(
                          e.target.value == "Yes"
                            ? "true"
                            : e.target.value == "No"
                            ? "false"
                            : "ALL"
                        );
                        setGetApi(getApi + 1);
                        setPageNo(1);
                      }}
                    >
                      {jobs.map((verdict) => {
                        return <option value={verdict}> {verdict} </option>;
                      })}
                    </select>
                  </div>
                ),
                accessor: "role",
                //Cell: e => {e.original.cjb},
                Cell: (row) => {
                  let checked = row.original.role == "admin" ? true : false;
                  let editing = ID == row.original._id;
                  //   setChecked(checked);
                  console.log("EDITING", ID);
                  //   const [checked,setChecked] = useState(row.row.role=="admin"?true:false);
                  return (
                    <div
                      className="button-group"
                      style={{ alignContent: "center" }}
                    >
                      <Switch
                          disabled={!editing}
                        checked={editing ? ischecked : checked}
                        onChange={(event) =>
                          setChecked(event.currentTarget.checked)
                        }
                        color="teal"
                        size="md"
                        thumbIcon={
                          editing ? (
                            ischecked ? (
                              <IconCheck
                                style={{ width: rem(12), height: rem(12) }}
                                color={theme.colors.teal[6]}
                                stroke={3}
                              />
                            ) : (
                              <IconX
                                style={{ width: rem(12), height: rem(12) }}
                                color={theme.colors.red[6]}
                                stroke={3}
                              />
                            )
                          ) : checked ? (
                            <IconCheck
                              style={{ width: rem(12), height: rem(12) }}
                              color={theme.colors.teal[6]}
                              stroke={3}
                            />
                          ) : (
                            <IconX
                              style={{ width: rem(12), height: rem(12) }}
                              color={theme.colors.red[6]}
                              stroke={3}
                            />
                          )
                        }
                      />
                    </div>
                  );
                },
                getProps: (state, rowInfo, column) => {
                  return {
                    style: {
                      color: rowInfo?.original?.my ? color : textColor,
                      background:
                        rowInfo?.original?._id === ID ? "#238ad9" : "#F0F7E6",
                    },
                  };
                },
                //minWidth: 140
              },
              {
                Header: <div>Edit/Delete</div>,
                id: "delete",
                accessor: "",
                show: isSuperAdmin,
                Cell: (row) => {
                  let editing = row.original._id == ID ? true : false;
                  return (
                    <div
                      className="button-group"
                      style={{ alignContent: "center" }}
                    >
                      {editing ? (
                        <Tooltip
                          arrow
                          title="Save"
                          placement="top"
                          TransitionComponent={Zoom}
                        >
                          <IconCheck
                            onClick={()=>{handleSave(row.original)}}
                            color="white"
                            className="button-edit rounded-circle"
                            size={23}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          arrow
                          title="Edit"
                          placement="top"
                          TransitionComponent={Zoom}
                        >
                          <IconEdit
                            onClick={() => {
                                
                              setID(row.original._id);
                              setChecked(
                                row.original.role == "admin" ? true : false
                              );
                            }}
                            color="white"
                            className="button-edit rounded-circle"
                            size={23}
                          />
                        </Tooltip>
                      )}
                      <Tooltip
                        arrow
                        title="Delete"
                        placement="top"
                        TransitionComponent={Zoom}
                      >
                        {/* <ActionIcon onClick={()=>{handleShow()}} size={25} className="button-edit"> */}
                        <IconTrash
                          color="white"
                          className="button-edit rounded-circle"
                          size={23}
                          onClick={() => {
                            handleDelete(row.original);
                          }}
                        />
                        {/* </ActionIcon> */}
                      </Tooltip>
                    </div>
                  );
                },
                // Cell: e =>{},
                getProps: (state, rowInfo, column) => {
                  return {
                    style: {
                      color: "white",
                      background:
                        rowInfo?.original?._id === ID ? "#238ad9" : "#8CAB3D",
                    },
                  };
                },
                minWidth: 69,
                fixed: "right",
              },
            ]}
            className=" -highlight text-dark h5"
          />
          <Stack className="float-end" spacing={1}>
            <Pagination
              count={pageData}
              color="primary"
              defaultPage={1}
              page={pageNo}
              onChange={handleChange}
            />
          </Stack>
          <div>
            <select
              name="pagesize"
              id="pagesize"
              onChange={(e) => {
                setPerPage(e.target.value);
                setGetApi(getApi + 1);
                setPageNo(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={0}>ALL</option>
            </select>
          </div>
        </div>
      </>
    );
  }
}
export default Users;
