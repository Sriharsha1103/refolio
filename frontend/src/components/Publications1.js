import ReactTable from "react-table-6";
import React, { useEffect, useState } from "react";
import "react-table-6/react-table.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Service from "../Service/http";
import HomeNavbar from "./RNavbar";
import { useNavigate } from "react-router-dom";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
function Publications1(){
    const service = new Service();
    const navigate = useNavigate();
    
    let [data, setData] = useState([]); /*Table data*/
  let [pageData, setPageData] = useState([]); /*Meta Data about pages*/
  let [color, Setcolor] = useState('');
  let [background, SetBackground] = useState("#81C784");
  let [textColor, SetTextcolor] = useState("");

  /*Tells when the api need to be called*/
  let [getApi, setGetApi] = useState(0);
 
  /*Value of the filter applied*/
  let [publicationFilterValue, setPublicationFilterValue] =useState("");
  let [branchFilterValue, setBranchFilterValue] =useState("");
  let [publishedByFilterValue, setPublishedByFilterValue] =useState("");
  let [c_j_bFilterValue, setc_j_bFilterValue] =useState("");
  
  let [yearFilterValue, setYearFilterValue] =useState("");

  let [nationalityFilterValue, setNationalityFilterValue] =useState("");
  let [authorsFilterValue,setAuthorsFilterValue] = useState("")
  
  let [scopusFilterValue, setScopusFilterValue] =useState("");
  





  /*List for Filter Dropdown*/
  // let yesNo = ['All', 'Yes', 'No']
  let [authors, setAuthors] = useState(["ALL","Single","First", "Second", "Third", "Fourth","Fifth","Others"])
  // let [verdicts, setVerdict] = useState(['All',"ACCEPTED", "WRONG ANSWER","TIME LIMIT EXCEEDED","RUNTIME ERROR","PENDING","OTHER","COMPILATION ERROR"]);
  // let [languages, setLanguage] = useState(['All',"CPP", "C#", "JAVA", "JAVASCRIPT", "PYTHON"]);
  
  /*Pagination Data*/
  let [pageNo, setPageNo]=useState(1);
  let [perPage, setPerPage]=useState(5);
  const handleChange= (event,v)=>{
    // console.log(v)
    setPageNo(v)
    setGetApi(getApi+1)

  }

  useEffect(()=>{
    // console.log("IN USEEFFECT")
    var a=localStorage.getItem('status')
    var b=localStorage.getItem('Verify')
    if(a=='false'){
        navigate("../")
    if(b=='false'){
            navigate("../verify")}
    }
    service.get("api/publications/data?title="+publicationFilterValue+"&branch="+branchFilterValue+"&username="+publishedByFilterValue+"&cjb="+c_j_bFilterValue+"&year="+yearFilterValue+"&nationality="+nationalityFilterValue+"&scl="+scopusFilterValue+"&author_no="+(authorsFilterValue==="ALL"?"":authorsFilterValue)+"&page="+pageNo+"&limit="+perPage).then((json)=>{
        console.log("JSON",json)
        setData(json.docs);
        setPageData(json.pages)
    }).catch((error)=>{

        console.log(error);
    });
  },[getApi])
  
    return(
      
        <>
          <HomeNavbar/>
          <div className="" style={{height: "90vh",
        width: "100vw",
      "backgroundColor":"#c5d299"}}>
        <ReactTableFixedColumns
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
                  console.log(row)
                  return <div>{((pageNo-1) * perPage)+row.index + 1}</div>;
              },
                // Cell: e =>{},
                getProps: (state, rowInfo, column) => {
                return {
                    style: {
                          color: (rowInfo?.original?.my) ? 'white' : 'white',
                          background: "#548C42" ,
                        },
                      };
                    },
                   minWidth: 50,
                fixed: 'left'
              },
          {
            Header: () => (<div>Publication<br/><input type="text" id="publication" name="publication"  onKeyPress={(e)=>{if(e.key==="Enter"){setGetApi(getApi+1);setPageNo(1)}}}onChange={(e)=>{setPublicationFilterValue(e.target.value);}}/></div>),
            accessor: "title",
            disableSortBy: true,
            // Cell: e =>{e.original.title},
            getProps: (state, rowInfo, column) => {
            return {
                style: {
                      color: (rowInfo?.original?.my) ? 'white' : 'white',
                      background: "#8CAB3D" ,  
                    },
                  };
                }, 
                minWidth: 237,
                fixed: 'left'
            }, 
            {
                Header: () => (<div>Branch<br/><input size="sm" type="text" id="branch" name="branch"  onKeyPress={(e)=>{if(e.key==="Enter"){setGetApi(getApi+1);setPageNo(1)}}}onChange={(e)=>{setBranchFilterValue(e.target.value);}}/></div>),
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
                Header: () => (<div>Authors<br/><input type="text" id="published_by" name="published_by"  onKeyPress={(e)=>{if(e.key==="Enter"){setGetApi(getApi+1);setPageNo(1)}}}onChange={(e)=>{setPublishedByFilterValue(e.target.value);}} /></div>),
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
                Header: () => (<div>C/J/B/BC<br/><input type="text" id="c_j_b" name="c_j_b"  onKeyPress={(e)=>{if(e.key==="Enter"){setGetApi(getApi+1);setPageNo(1)}}}onChange={(e)=>{setc_j_bFilterValue(e.target.value);}} /></div>),
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
                Header: "Name of C/J/B/BC",
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
                Header: "Volume",
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
                Header: "Issue",
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
                Header: () => (<div>Year<br/><input type="text" id="year" name="year"  onKeyPress={(e)=>{if(e.key==="Enter"){setGetApi(getApi+1);setPageNo(1)}}}onChange={(e)=>{setYearFilterValue(e.target.value);}}/></div>),
                accessor: "year",
                //Cell: e =>{e.original.year},
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
                Header: "Month",
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
                //minWidth: 210
              },
              {
                Header: "ISSN/ISBN/DOI",
                accessor: "doi",
                //Cell: e =>{e.original.doi},
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
                Header: () => (<div>Inter/National<br/><input type="text" id="nationality" name="nationality"  onKeyPress={(e)=>{if(e.key==="Enter"){setGetApi(getApi+1);setPageNo(1)}}}onChange={(e)=>{setNationalityFilterValue(e.target.value);}}/></div>),
                accessor: "nationality",
                //Cell: e =>{e.original.nationality},
                getProps: (state, rowInfo, column) => {
                  return {
                    style: {
                      color: (rowInfo?.original?.my) ? color : textColor,
                      background: rowInfo?.original?.my ? background : "#A6BE87",
                    },
                  };
                },
                minWidth: 140
              },
              {  
                Header: "Organizor",
                accessor: "organised_by",
                //Cell: e =>{e.original.organised_by},
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
                Header: "In Proceedings",
                accessor: "is_proceeding",
                //Cell: e =>{e.original.is_proceeding},
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
                Header: "Abstract Published",
                accessor: "is_published",
                //Cell: e =>{e.original.is_published},
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
                Header: () => (<div>Scopus/WoS/SCI<br/><input type="text" id="problem" name="problem"  onKeyPress={(e)=>{if(e.key==="Enter"){setGetApi(getApi+1);setPageNo(1)}}}onChange={(e)=>{setScopusFilterValue(e.target.value);}} /></div>),
                accessor: "scl",
                //Cell: e =>{e.original.scl},
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
                Header: "Citation in Scopus/WoS",
                accessor: "citation_scopus",
                //Cell: e =>{e.original.citation_scopus},
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
                Header: "Citation in GoogleScholar",
                accessor: "citation_google",
                //Cell: e =>{e.original.citation_google},
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
                Header: "Link",
                accessor: "link",
                Cell: e =><a href={e.original.link} color={textColor} target="_blank"> {e.original.link} </a>,
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
                Header: "Affiliated?",
                accessor: "is_affilated",
                //Cell: e =>{e.original.is_affilated},
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
                Header: () => (<div>Are you author?<br/><select id="author" onChange={(e) => {setAuthorsFilterValue(e.target.value); setGetApi(getApi+1);setPageNo(1)}} >{authors.map(verdict => {return (<option value={verdict}> {verdict} </option>)})}</select></div>),
                accessor: "author_no",
                //Cell: e =>{e.original.author_no},
                
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
                Header: "Page Number",
                accessor: "page-number",
                Cell: e =><a>{e.original.starting_page+"-"+e.original.ending_page}</a> ,
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
                Header: "Article Cite",
                accessor: "cite",
                tipText: e=> <a>{e.original.cite}</a> ,
                //Cell: e =>{e.original.cite},
                getProps: (state, rowInfo, column) => {
                  return {
                    style: {
                      color: (rowInfo?.original?.my) ? color : textColor,
                      background: rowInfo?.original?.my ? background : "#F0F7E6",
                    },
                  };
                },
                minWidth: 420
              },
        ]}
        className=" -highlight text-dark h5"
      />
      <Stack className="float-end" spacing={2}>
                  <Pagination
                    count={pageData}
                    color="primary"
                    defaultPage={1}
                    page={pageNo}
                    onChange={handleChange}
                    
                  />
      </Stack>
      <div><select name="pagesize" id="pagesize" onChange={(e)=>{setPerPage(e.target.value);setGetApi(getApi+1);setPageNo(1)}}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option></select></div>
    </div>
    </>
  );
}
export default Publications1;