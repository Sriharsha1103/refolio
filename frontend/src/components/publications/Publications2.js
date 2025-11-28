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
import { ExportCSV } from "./ExportCSV";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import DatePicker from 'react-datepicker';
import { IconTrash } from '@tabler/icons-react'
import Modal from 'react-bootstrap/Modal';
import HelpModal from "./HelpModal";
import { Center } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Publication } from "../../Service/keyValueMap";
import { Tab } from "../login/Actions";

const ReactTableFixedColumns = withFixedColumns(ReactTable);
// const ReactTableFixedColumns = ReactTable;a
function Publications2() {
    const service = new Service();
    const navigate = useNavigate();
    const verify = useSelector((state)=>state.verify);
    const loggedIn = useSelector((state)=>state.logged);
    const dispatch=useDispatch();
    let [data, setData] = useState([]); /*Table data*/
    let [pageData, setPageData] = useState([]); /*Meta Data about pages*/
    let [color, Setcolor] = useState('');
    let [background, SetBackground] = useState("#81C784");
    let [textColor, SetTextcolor] = useState("");
    let isAdmin = useSelector((state)=>state.isAdmin);
    let isSuperAdmin = useSelector((state)=>state.isSuperAdmin);

    /*Tells when the api need to be called*/
    let [getApi, setGetApi] = useState(0);

    /*Value of the filter applied*/
    let [publicationFilterValue, setPublicationFilterValue] = useState("");
    let [branchFilterValue, setBranchFilterValue] = useState("");
    let [publishedByFilterValue, setPublishedByFilterValue] = useState("");
    let [c_j_bFilterValue, setc_j_bFilterValue] = useState("ALL");

    let [yearFilterValue, setYearFilterValue] = useState("");

    let [nationalityFilterValue, setNationalityFilterValue] = useState("");
    let [authorsFilterValue, setAuthorsFilterValue] = useState("")

    let [scopusFilterValue, setScopusFilterValue] = useState("");
    let [startDate, setStartDate] = useState("")
    let [endDate, setEndDate] = useState("")

    const [show, setShow] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    let [jobs, setJobs] = useState(["ALL","C","J","B","BC"])
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
    const handleSearch = () => { if (startDate && endDate) { setYearFilterValue("") ; setGetApi(getApi + 1); setShow(false)} };

  

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
        let confirm =window.confirm('This action will permenently delete '+data.title+' publication.')
        if(confirm){
            service.delete('api/publications/data/'+data._id).then((res)=>{
            // console.log("DELETD",res);
            window.alert('Successfully Deleted '+data.title+' Publication.')
            window.location.reload()
        }).catch((err)=>{
            console.log("ERROR",err)
            window.alert('Error while deleting the publication')
        })
    }else{
        window.alert("Cancelled the delete action."); 
      }
    }
    const handleClear = () => {
        // setEndDate("")
        // // setEndMonth("")
        // // setEndYear("")
        // setStartDate("")
        // // setStartMonth("")
        // // setStartYear("")
        // setRequired(false)
        // setAuthorsFilterValue("ALL")
        // setBranchFilterValue("")
        // setNationalityFilterValue("")
        // setPublicationFilterValue("")
        // setPublishedByFilterValue("")
        // setScopusFilterValue("")
        // setYearFilterValue("")
        // setc_j_bFilterValue("ALL")
        // setGetApi(0)
        // setPerPage(10)
        // setPageNo(1)
        window.location.reload()
    }
    useEffect(() => {
        dispatch(Tab('publication'));
    if(!loggedIn){
        navigate("../")
    if(!verify){
            navigate("../verify")}
    }

        service.get("api/publications/data?title=" + publicationFilterValue + "&branch=" + branchFilterValue + "&username=" + publishedByFilterValue + "&cjb=" + (c_j_bFilterValue==="ALL"?"":c_j_bFilterValue) + "&year=" + yearFilterValue + "&nationality=" + nationalityFilterValue + "&scl=" + scopusFilterValue + "&author_no=" + (authorsFilterValue === "ALL" ? "" : authorsFilterValue) + "&page=" + pageNo + "&limit=" + perPage + "&startDate=" + startDate + "&endDate=" + endDate).then((json) => {
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
           <Modal show={show} onHide={handleClose} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Range Date Search</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-green">
                    {/* <HelpModal/> */}
                    {/* <form id="date-entry" ref={formRef} onSubmit={handleSearch}> */}
                    {Required ? <b style={{ "color": "red" }}>Both the fields are required to search*</b> : ""}
                    <Center><DatePicker
                        selected={startDate}
                        onChange={(date) => { setStartDate(date); }}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                    //   required="true"
                    /> to <DatePicker
                            selected={endDate}
                            onChange={(date) => { setEndDate(date);  }}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                        // required="true"
                        // onChangeRaw={(event) => console.log(event.target.value)}
                        />
                        <br />
                        <br /><br />
                    </Center>
                    <Center>

                        <Button variant="contained" color="primary" onClick={() => { (startDate !== "" && endDate !== "") ? handleSearch() : setRequired(true) }}>
                            Search
                        </Button>
                    </Center>
                    {/* </form> */}
                </Modal.Body>
                {/* <Modal.Footer><
          <Button variant="contained" color="primary" onClick={handleClose}>
            Search
          </Button>
        </Modal.Footer> */}
            </Modal>
            
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
                        <ExportCSV csvData={data} fileName={"Publications"} />
                    </MDBCol>
                    <MDBCol md="4" >
                        <Button  variant="contained" color='secondary' onClick={handleShow}>Advance Search</Button>
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
                            Header: () => (<div>{Publication.title}<br /><input type="text" id="publication" name="publication" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setPublicationFilterValue(e.target.value); }} /></div>),
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
                            Header: () => (<div>{Publication.branch}<br /><input size="sm" type="text" id="branch" name="branch" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setBranchFilterValue(e.target.value); }} /></div>),
                            accessor: "branch",
                            //Cell: e =>{e.original.title},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#A6BE87",
                                    },
                                };
                            },
                            minWidth: 100
                        },
                        {
                            Header: () => (<div>{Publication.username}<br /><input type="text" id="published_by" name="published_by" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setPublishedByFilterValue(e.target.value); }} /></div>),
                            accessor: "username",
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
                            Header: () => (<div>{Publication.cjb}<br /><select id="c_j_b" onChange={(e) => { setc_j_bFilterValue(e.target.value); setGetApi(getApi + 1); setPageNo(1) }} >{jobs.map(verdict => { return (<option value={verdict}> {verdict} </option>) })}</select></div>),
                            accessor: "cjb",
                            //Cell: e => {e.original.cjb},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#F0F7E6",
                                    },
                                };
                            },
                            //minWidth: 140
                        },
                        {
                            Header: Publication.name_cjb,
                            accessor: "name_cjb",
                            //Cell: e => {e.original.name_cjb},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#A6BE87",
                                    },
                                };
                            },
                            minWidth: 210
                        },
                        {
                            Header: Publication.vol,
                            accessor: "vol",
                            //Cell: e =>{e.original.vol},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#C3D496",
                                    },
                                };
                            },
                            //minWidth: 210
                        },
                        {
                            Header: Publication.issue,
                            accessor: "issue",
                            //Cell: e =>{e.original.issue},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#F0F7E6",
                                    },
                                };
                            },
                            //minWidth: 140
                        },
                        {
                            Header: () => (<div>{Publication.year}<br /><input type="text" id="year" name="year" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setYearFilterValue(e.target.value); }} /></div>),
                            accessor: "year",
                            Cell: e => <a>{fun(e.original.year)}</a>,
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
                            Header: Publication.month,
                            accessor: "month",
                            //Cell: e =>{e.original.month},
                            getProps: (state, rowInfo, column) => {
                              return {
                                style: {
                                  color: (rowInfo?.original?.my) ? color : textColor,
                                  background: rowInfo?.original?.my ? background : "#C3D496",
                                },
                              };
                            },
                        // minWidth: 210
                          },
                        {
                            Header: Publication.doi,
                            accessor: "doi",
                            //Cell: e =>{e.original.doi},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#C3D496",
                                    },
                                };
                            },
                            minWidth: 140
                        },
                        {
                            Header: () => (<div>{Publication.nationality}<br /><input type="text" id="nationality" name="nationality" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setNationalityFilterValue(e.target.value); }} /></div>),
                            accessor: "nationality",
                            //Cell: e =>{e.original.nationality},
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
                            Header: Publication.organised_by,
                            accessor: "organised_by",
                            //Cell: e =>{e.original.organised_by},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#A6BE87",
                                    },
                                };
                            },
                            //minWidth: 210
                        },
                        {
                            Header: Publication.is_proceeding,
                            accessor: "is_proceeding",
                            //Cell: e =>{e.original.is_proceeding},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#C3D496",
                                    },
                                };
                            },
                            //minWidth: 140
                        },
                        {
                            Header: Publication.is_published,
                            accessor: "is_published",
                            //Cell: e =>{e.original.is_published},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#F0F7E6",
                                    },
                                };
                            },
                            //minWidth: 420
                        },
                        {
                            Header: () => (<div>{Publication.scl}<br /><input type="text" id="problem" name="problem" onKeyPress={(e) => { if (e.key === "Enter") { setGetApi(getApi + 1); setPageNo(1) } }} onChange={(e) => { setScopusFilterValue(e.target.value); }} /></div>),
                            accessor: "scl",
                            //Cell: e =>{e.original.scl},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#A6BE87",
                                    },
                                };
                            },
                            //minWidth: 210
                        },
                        {
                            Header: Publication.citation_scopus,
                            accessor: "citation_scopus",
                            //Cell: e =>{e.original.citation_scopus},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#C3D496",
                                    },
                                };
                            },
                            //minWidth: 140
                        },
                        {
                            Header: Publication.citation_google,
                            accessor: "citation_google",
                            //Cell: e =>{e.original.citation_google},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#F0F7E6",
                                    },
                                };
                            },
                            //minWidth: 420
                        },
                        {
                            Header: Publication.link,
                            accessor: "link",
                            Cell: e => <a href={e.original.link} color={textColor} target="_blank"> {e.original.link} </a>,
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#A6BE87",
                                    },
                                };
                            },
                            minWidth: 210
                        },
                        {
                            Header: Publication.is_affilated,
                            accessor: "is_affilated",
                            //Cell: e =>{e.original.is_affilated},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#C3D496",
                                    },
                                };
                            },
                            //minWidth: 140
                        },
                        {
                            Header: () => (<div>{Publication.author_no}<br /><select id="author" onChange={(e) => { setAuthorsFilterValue(e.target.value); setGetApi(getApi + 1); setPageNo(1) }} >{authors.map(verdict => { return (<option value={verdict}> {verdict} </option>) })}</select></div>),
                            accessor: "author_no",
                            //Cell: e =>{e.original.author_no},

                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#F0F7E6",
                                    },
                                };
                            },
                            //minWidth: 420
                        },
                        {
                            Header: "Page Number",
                            accessor: "page-number",
                            Cell: e => <a>{e.original.starting_page + "-" + e.original.ending_page}</a>,
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#A6BE87",
                                    },
                                };
                            },
                            //minWidth: 210
                        },
                        {
                            Header: Publication.cite,
                            accessor: "cite",
                            tipText: e => <a>{e.original.cite}</a>,
                            //Cell: e =>{e.original.cite},
                            getProps: (state, rowInfo, column) => {
                                return {
                                    style: {
                                        color: (rowInfo?.original?.my) ? color : textColor,
                                        background: rowInfo?.original?.my ? background : "#C3D496",
                                    },
                                };
                            },
                            minWidth: 420
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
                                         
                                        <HelpModal edit={row.original}/>
                                       
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
export default Publications2;