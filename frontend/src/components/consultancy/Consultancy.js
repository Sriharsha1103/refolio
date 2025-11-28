import ReactTable from "react-table-6";
import React, { useEffect, useState, useRef } from "react";
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

import {  IconTrash } from '@tabler/icons-react'


import { useDispatch, useSelector } from "react-redux";
import { ConsultancyKey } from "../../Service/keyValueMap";
import EditConsultancy from "./EditConsultancy";
import { ConsultancyExportCSV } from "./ConsultancyExportCSV";
import { Tab } from "../login/Actions";
// import { titles } from "../../../backend/lib/fetchUtils";

const ReactTableFixedColumns = withFixedColumns(ReactTable);
// const ReactTableFixedColumns = ReactTable;a
function Consultancy() {
    const service = new Service();
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const verify = useSelector((state)=>state.verify);
    const loggedIn = useSelector((state)=>state.logged);
    let [data, setData] = useState([]); /*Table data*/
    let [pageData, setPageData] = useState([]); /*Meta Data about pages*/
    let [color, Setcolor] = useState('');
    let [background, SetBackground] = useState("#81C784");
    let [textColor, SetTextcolor] = useState("");
    let isAdmin = useSelector((state)=>state.isAdmin);
    let isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
    let [titles, setTitles ] = useState([]);
    /*Tells when the api need to be called*/
    let [getApi, setGetApi] = useState(0);

    /*Value of the filter applied*/
    let [publicationFilterValue, setPublicationFilterValue] = useState("");
    let [branchFilterValue, setBranchFilterValue] = useState("");
    let [publishedByFilterValue, setPublishedByFilterValue] = useState("");
    let [c_j_bFilterValue, setc_j_bFilterValue] = useState("ALL");

    // let [yearFilterValue, setYearFilterValue] = useState("");

    let [nationalityFilterValue, setNationalityFilterValue] = useState("");
    let [authorsFilterValue, setAuthorsFilterValue] = useState("")

    let [scopusFilterValue, setScopusFilterValue] = useState("");
    // let [startDate, setStartDate] = useState("")
    // let [endDate, setEndDate] = useState("")

    const [show, setShow] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    // let [jobs, setJobs] = useState(["ALL","Design","Utility"])
    let [authors, setAuthors] = useState(["ALL", "Single", "First", "Second", "Third", "Fourth", "Fifth", "Others"])
    // let [verdicts, setVerdict] = useState(['All',"ACCEPTED", "WRONG ANSWER","TIME LIMIT EXCEEDED","RUNTIME ERROR","PENDING","OTHER","COMPILATION ERROR"]);
    // let [languages, setLanguage] = useState(['All',"CPP", "C#", "JAVA", "JAVASCRIPT", "PYTHON"]);

    /*Pagination Data*/
    let [pageNo, setPageNo] = useState(1);
    let [perPage, setPerPage] = useState(10);
    // let [startMonth, setStartMonth] = useState("");
    // let [startYear, setStartYear] = useState("");
    // let [endMonth, setEndMonth] = useState("");
    // let [endYear, setEndYear] = useState("");
    let [Required, setRequired] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => { setShow(true); };
    // const handleSearch = () => { if (startDate && endDate) { setYearFilterValue("") ; setGetApi(getApi + 1); setShow(false)} };

  

    const handleChange = (event, v) => {
        // console.log(v)
        setPageNo(v)
        setGetApi(getApi + 1)

    }
    const fun = (e) => {
        var isod = new Date(e).toLocaleDateString().split('/');
        return isod[2]
    }
    const handleDelete = (data) => {
        // console.log('data',data);
        let confirm =window.confirm('This action will permenently delete '+data.title+' consultancy project.')
        if(confirm){
            service.delete('api/consultancy/data/'+data._id).then((res)=>{
            // console.log("DELETD",res);
            window.alert('Successfully Deleted '+data.title+' consultancy project.')
            window.location.reload()
        }).catch((err)=>{
            console.log("ERROR",err)
            window.alert('Error while deleting the consultancy project')
        })
    }else{
        window.alert("Cancelled the delete action."); 
      }
    }
    const handleClear = () => {
        window.location.reload()
    }
    useEffect(() => {
        dispatch(Tab('consultancy'));
    if(!loggedIn){
        navigate("../")
    if(!verify){
            navigate("../verify")}
    }
    if(titles.length==0){
        service.get('api/consultancy/titles').then((res)=>{
          // console.log('titles',res)
          setTitles(res);
          // console.log("inside",titles)
        }).catch((error)=>{
          console.log("ERROR",error)
        })}

        service.get("api/consultancy/data?title=" + publicationFilterValue + "&branch=" + branchFilterValue + "&authors=" + authorsFilterValue + "&co=" + publishedByFilterValue + "&industry=" +nationalityFilterValue+"&ngo="+scopusFilterValue+ "&page=" + pageNo + "&limit=" + perPage ).then((json) => {
            // console.log("JSON", json)
            setData(json.docs);
            setPageData(json.limit == 0 ? 1 : json.pages)
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

        }).catch((error) => {
            window.alert('Error while fetching the publications.\n Please try again later.')
            console.log(error);
        });
    }, [getApi])
    // useEffect(()=>{
    //     let admin= localStorage.getItem('isAdmin')
    //     setIsAdmin(admin);
    //     console.log(localStorage.getItem('isAdmin'))
    // },[])

    if(loggedIn){
    return (

        <>          
            <HomeNavbar />
            <div className="p-3" style={{
                height: 0<data.length && data.length<10?"90vh":"100%",
                width: "99vw",
                "backgroundColor": "#c5d299"
            }}>


                {/* <CSVLink
  data={data}
  filename={"my-file.csv"}
  className="btn btn-primary"
  target="_blank"
>
  Download me
</CSVLink> */}
                <br />
                <MDBRow>
                    <MDBCol md="4">
                        <ConsultancyExportCSV csvData={data} fileName={"Consultancy"} />
                    </MDBCol>
                    <MDBCol md="4" >
                        {/* <Button  variant="contained" color='secondary' onClick={handleShow}>Advance Search</Button> */}
                    </MDBCol>
                    <MDBCol md="4">
                        <Button  variant="contained" color='error' onClick={handleClear}>Clear Filter</Button>
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
                                return <div>{((pageNo - 1) * perPage) + row.index + 1}</div>;
                            },
                            // Cell: e =>{},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? 'white' : 'white',
                                        background: "#548C42",
                                    },
                                };
                            },
                            minWidth: 50,
                            fixed: 'left'
                        },
                        {
                            Header: () => (<div>{ConsultancyKey.title}<br /><input type="text" id="publication" name="publication" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setPublicationFilterValue(e.target.value); }} /></div>),
                            accessor: "title",
                            disableSortBy: true,
                            // Cell: e =>{e.original.title},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? 'white' : 'white',
                                        background: "#8CAB3D",
                                    },
                                };
                            },
                            minWidth: 237,
                            fixed: 'left'
                        },
                        {
                            Header: () => (<div>{ConsultancyKey.pi}<br /><input type="text" id="year" name="year" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setAuthorsFilterValue(e.target.value); }} /></div>),
                            accessor: "pi",
                            // Cell: e => <a>{(e.original.year)}</a>,\\
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#A6BE87",
                                    },
                                };
                            },
                            //minWidth: 420
                        },
                        {
                            Header: () => (<div>{ConsultancyKey.co_pi}<br /><input type="text" id="published_by" name="published_by" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setPublishedByFilterValue(e.target.value); }} /></div>),
                            accessor: "co_pi",
                            //Cell: e =>{e.original.username},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#C3D496",
                                    },
                                };
                            },
                            minWidth: 210
                        },
                        {
                            Header: () => (<div>{ConsultancyKey.dept}<br /><input size="sm" type="text" id="branch" name="branch" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setBranchFilterValue(e.target.value); }} /></div>),
                            accessor: "dept",
                            Cell: (row) =>{
                                let l = row.original.dept.join(", ");
                                return (<div>{l}</div>)
                            },
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#F0F7E6",
                                    },
                                };
                            },
                            minWidth: 100
                        },
                        {
                            Header: () => (<div>{ConsultancyKey.industry}<br /><input type="text" id="nationality" name="nationality" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setNationalityFilterValue(e.target.value); }} /></div>),
                            accessor: "industry",
                            // Cell: (row) => {
                            //     //   console.log(row)

                            //     let formattedDate = row.original.published;
                            //     if(row.original.published!=null){
                            //     let dateObject = new Date(row.original.published);
                            //     formattedDate = dateObject.toLocaleDateString("en-GB")
                            //     }
                                
                            //     return <div>{formattedDate}</div>;
                            // },
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#F0F7E6",
                                    },
                                };
                            },
                            //minWidth: 210
                        },
                        {
                            Header: () => (<div>{ConsultancyKey.ngo}<br /><input type="text" id="nationality" name="nationality" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setScopusFilterValue(e.target.value); }} /></div>),
                            accessor: "ngo",
                            // Cell: (row) =>{
                            //     let l = row.original.year.join(" - ");
                            //     return (<div>{l}</div>)
                            // },
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#F0F7E6",
                                    },
                                };
                            },
                            minWidth: 140
                        },
                        {
                            Header: ConsultancyKey.amount,
                            accessor: "amount",
                            //Cell: e => {e.original.cjb},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#A6BE87",
                                    },
                                };
                            },
                            //minWidth: 140
                        },
                       
                         {
                            Header: <div>Edit /<br/> Delete</div>,
                            id: "admin",
                            accessor: "",
                            show : isAdmin || isSuperAdmin,
                            Cell: (row) => {
                                //   console.log(row)
                                return (
                                    <div className="button-group">
                                         
                                        <EditConsultancy edit={row.original} titles={titles} />
                                       
                                        <Tooltip arrow title="Delete" placement="top" TransitionComponent={Zoom}>
                                     {/* <ActionIcon onClick={()=>{handleShow()}} size={25} className="button-edit"> */}
                                         <IconTrash color="white" className="button-edit" size={23} onClick={()=>{handleDelete(row.original);}}/>
                                     {/* </ActionIcon> */}
                                     </Tooltip>
                               
                                     </div >   
                                
                                )
                            },
                            // Cell: e =>{},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: 'white',
                                        background: "#8CAB3D",
                                    },
                                };
                            },
                            minWidth: 69,
                            fixed: 'right'
                        }
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
                <div><select name="pagesize" id="pagesize" onChange={(e) => { setPerPage(e.target.value); setGetApi(getApi + 1); setPageNo(1) }}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option><option value={0}>ALL</option></select></div>
            </div>
        </>
    )};
}
export default Consultancy;