import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
// import Select from "@mui/material/Select";
import { DateInput } from "@mantine/dates";
import Modal from "react-bootstrap/Modal";
import MenuItem from "@mui/material/MenuItem";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../RNavbar";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Button } from '@mui/material';
import Service from '../../Service/http';
import { Departments, PatentsKey, Publication } from '../../Service/keyValueMap';

import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';


import { MultiSelect,TextInput, Textarea,Select, NumberInput } from "@mantine/core";
import { PatentsBulkUpload } from "./PatentsBulkUpload";
import { Tab } from "../login/Actions";
// import { events } from "../../../backend/db/LoginSchema";


function NewPatent() {
  // const classes = useStyles();
  const dispatch=useDispatch();
  const loggedIn = useSelector((state)=>state.logged);
  const verify = useSelector((state)=>state.verify);
  const isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
  const isAdmin = useSelector((state)=>state.isAdmin);
  const service = new Service();
  const multiSelectRef = React.useRef(null);
  const designRef = React.useRef(null)
  const patentRef = React.useRef(null)

   // console.log("HERE", here)
  // const username = query.get('')
  const formRef = React.useRef();
  const [design,setDesign] = useState("")
  const [body, setBody] = useState({
    authors: "",
    dept: [],
    pat_no: "",
    title: "",
    filed: null,
    abstract: "",
    design_utility: null,
    published: null,
    year: null,
    country: ""
  });

  const [cjb, setCjb] = useState([]);
  const [titles, setTitles] = useState([]);
  const [send, setSend] = useState(0);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleChangeDept = (event) => {
   
    setCjb(event);
    setBody({
      authors: body.authors,
      dept: event,
      pat_no: body.pat_no,
      title: body.title,
      filed: body.filed,
      abstract: body.abstract,
      design_utility: body.design_utility,
      published: body.published,
      year: body.year,
      country: body.country
    });
  };
  const handleChangeYear = (event) => {
    // setYearvalue(event.target.value);
    setBody({
        authors: body.authors,
        dept: body.dept,
        pat_no: body.pat_no,
        title: body.title,
        filed: body.filed,
        abstract: body.abstract,
        design_utility: body.design_utility,
        published: body.published,
        year: event,
        country: body.country
      });
  };
  const handleChangeFiled = (event) => {
    // setMonthValue(event.target.value);
    setBody({
        authors: body.authors,
        dept: body.dept,
        pat_no: body.pat_no,
        title: body.title,
        filed: event,
        abstract: body.abstract,
        design_utility: body.design_utility,
        published: body.published,
        year: body.year,
        country: body.country
      });
  };

 
  const handleChangePublished = (event) => {

    setBody({
        authors: body.authors,
        dept: body.dept,
        pat_no: body.pat_no,
        title: body.title,
        filed: body.filed,
        abstract: body.abstract,
        design_utility: body.design_utility,
        published: event,
        year: body.year,
        country: body.country
      });
  };

  const handleChangeDesign = (event) => {
    setDesign(event);
    // body.author_no = event.target.value
    setBody({
        authors: body.authors,
        dept: body.dept,
        pat_no: body.pat_no,
        title: body.title,
        filed: body.filed,
        abstract: body.abstract,
        design_utility: event,
        published: body.published,
        year: body.year,
        country: body.country
      });
  };
  const handleChangePatent = (event) => {
    // setAuthorNo(event.target.value);
    // body.author_no = event.target.value
    setBody({
        authors: body.authors,
        dept: body.dept,
        pat_no: event,
        title: body.title,
        filed: body.filed,
        abstract: body.abstract,
        design_utility: body.design_utility,
        published: body.published,
        year: body.year,
        country: body.country
      });
  };
  const onSubmit = (event) => {
    console.log("HERE sub",event)
    
    if(body.design_utility==""||body.design_utility==null){
      window.alert('Select Design or Utility')
      event.preventDefault()
    }
    else{
        // designRef.current.setCustomValidity((design===""||design===null)?"Please Select A Value.":"")
        
      let confirm = window.confirm("This action will add the data into the Database")
      if(confirm){
    service
      .post("api/patents/data", body)
      .then((json) => {
        // console.log("JSON", json);
        window.alert("Succesfully Added "+body.title)
        navigate(-1);
      })
      .catch((error) => {
        window.alert("Error while adding "+body.title+ ". \nPlease Try again later.")
        console.log(error);
      });
    }else{
      window.alert("Cancelled the insert action."); 
      event.preventDefault()
    }}
    
    // console.log("EVENT",body)
  };
  const handleChange = (e) => {
    console.log("EEEE", e)
   if (e.currentTarget.id === "title") {
      // body.title = e.target.value
      console.log(e.currentTarget.value)
      setBody({
        authors: body.authors,
        dept: body.dept,
        pat_no: body.pat_no,
        title: e.currentTarget.value,
        filed: body.filed,
        abstract: body.abstract,
        design_utility: body.design_utility,
        published: body.published,
        year: body.year,
        country: body.country
      });
    } else if (e.currentTarget.id === "authors") {
      // body.username = e.target.value
      setBody({
        authors: e.currentTarget.value,
        dept: body.dept,
        pat_no: body.pat_no,
        title: body.title,
        filed: body.filed,
        abstract: body.abstract,
        design_utility: body.design_utility,
        published: body.published,
        year: body.year,
        country: body.country
      });
    } else if (e.currentTarget.id === "pat_no") {
      // body.name_cjb = e.target.value
      setBody({
        authors: body.authors,
        dept: body.dept,
        pat_no: e.currentTarget.value,
        title: body.title,
        filed: body.filed,
        abstract: body.abstract,
        design_utility: body.design_utility,
        published: body.published,
        year: body.year,
        country: body.country
      });
    } else if (e.currentTarget.id === "abstarct") {
      // body.vol = e.target.value
      setBody({
        authors: body.authors,
        dept: body.dept,
        pat_no: body.pat_no,
        title: body.title,
        filed: body.filed,
        abstract: e.currentTarget.value,
        design_utility: body.design_utility,
        published: body.published,
        year: body.year,
        country: body.country
      });
    } else{
        setBody({
            authors: body.authors,
            dept: body.dept,
            pat_no: body.pat_no,
            title: body.title,
            filed: body.filed,
            abstract: body.abstract,
            design_utility: body.design_utility,
            published: body.published,
            year: body.year,
            country: e.currentTarget.value
          });
    } 
   
    // console.log("IN HANDLE CHANGE", body)
  };
  // const navigate = useNavigate();
    useEffect(()=>{
      dispatch(Tab('new-patent'));
      if(!loggedIn){
          navigate("../")}
      else if(!verify){
        navigate("../verify")
      }else if(isSuperAdmin){
        navigate("../publications")
      }
      if(titles.length==0){
      service.get('api/patents/number').then((res)=>{
        // console.log('titles',res)
        setTitles(res);
        // console.log("inside",titles)
      }).catch((error)=>{
        console.log("ERROR",error)
      })
    }
    },[])
  return (
    <>
      {/* <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Sample Publication Data</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            overflowY: "scroll",
            paddingBottom: "20px",
            backgroundColor: "#c5d299",
          }}
        >
          <HelpModal />
          <br />
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" color="error" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
      <HomeNavbar />
      <div
        style={{
          height: "fill",
          width: "100wh",
          backgroundColor: "#c5d299",
          paddingBottom: "100px",
        }}
      >
        {/* <br/> */}
        <MDBContainer fluid className="h-custom">
          <MDBRow className="h-100">
            <MDBCol col="12" className="m-4">
       {isAdmin?<MDBRow end>
                    
                    <MDBCol md="4">
                        <PatentsBulkUpload titles={titles}/>
                    </MDBCol>
                </MDBRow>:"" }
                <br/>
              <MDBCard
                className="card-registration card-registration-2"
                style={{ borderRadius: "15px" }}
              >
                <MDBCardBody className="p-0">
                  <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                    <MDBRow>
                      <MDBCol md="6" className="p-5 bg-white">
                        <h3
                          className="fw-normal mb-5"
                          style={{ color: "#6C9449" }}
                        >
                          Patent Information
                        </h3>
                        <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={PatentsKey.title}
                        placeholder={PatentsKey.title}
                        onChange={(event)=>{handleChange(event)}}
                        id="title"
                        withAsterisk
                        required
                        />
                        <br />
                        <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={PatentsKey.authors+ ' (Add multiple authors seperated by ",")'}
                        id="authors"
                        placeholder={PatentsKey.authors}
                        onChange={(event)=>{handleChange(event)}}
                        withAsterisk
                        required
                        />
                        <br />
                        <NumberInput
                        ref={patentRef}
                         label={PatentsKey.pat_no} 
                         placeholder="Enter A valid Patent Number" 
                         hideControls 
                         allowDecimal={false}
                         allowNegative={false}
                         min={2000}
                         onChange={(event)=>{handleChangePatent(event)}}
                         id="pat_no"
                        withAsterisk
                        required
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                         />
                        {/* <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={PatentsKey.pat_no}
                        placeholder={PatentsKey.pat_no}
                        onChange={(event)=>{handleChange(event)}}
                        id="pat_no"
                        withAsterisk
                        required
                        /> */}
                        <br />
                        <MDBRow>
                          <MDBCol md="6">
                           
                              <MultiSelect 
                               ref={multiSelectRef}
                              styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                              style={{"text-align":"left"}} 
                              withAsterisk 
                              placeholder="Select At least One" 
                              label={PatentsKey.dept} 
                              searchable 
                              id = "dept"
                              data={Departments} 
                            //   value={cjb} 
                              onChange={(e)=>{handleChangeDept(e)}} />
                                
                            {/* </FormControl> */}
                          </MDBCol>

                          <MDBCol md="6">
                          <Select
                          ref={designRef}
                          styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                          style={{"text-align":"left"}}
      label={PatentsKey.design_utility}
      placeholder="Select One"
      data={['Design','Utility']}
      value={design}
      onChange={(e)=>{handleChangeDesign(e)}}
    //   withAsterisk
      required
    />
                           
                          </MDBCol>
                        </MDBRow>
                        <br />
                      </MDBCol>

                      <MDBCol md="6" className="bg-indigo p-5">
                        <br/>
                        <br/>
                        <br/>
                        <MDBRow>
                            <MDBCol md="4">
                                <DateInput variant="filled" styles={{"label": {"color": "white","text-align":"left"}}}
                          style={{"text-align":"left"}} minDate={new Date("01-01-2012")}
      maxDate={new Date()} withAsterisk required label={PatentsKey.filed} valueFormat="DD MMM YYYY" placeholder="Select Date" onChange={(e)=>{handleChangeFiled(e);}}/>
                            </MDBCol>
                            <MDBCol md="4">
                                <DateInput variant="filled" styles={{"label": {"color": "white","text-align":"left"}}}
                          style={{"text-align":"left"}} minDate={new Date("01-01-2012")}
      maxDate={new Date()}valueFormat="DD MMM YYYY" label={PatentsKey.published} placeholder="Select Date" onChange={(e)=>{handleChangePublished(e);}}/>
                            </MDBCol>
                            <MDBCol md="4">
                                <DateInput variant="filled" styles={{"label": {"color": "white","text-align":"left"}}}
                          style={{"text-align":"left"}} minDate={new Date("01-01-2012")}
      maxDate={new Date()} valueFormat="DD MMM YYYY" label={PatentsKey.year} placeholder="Select Date" onChange={(e)=>{handleChangeYear(e);}}/>
                            </MDBCol>
                        </MDBRow>
                        <br />
                        <Textarea
                        styles={{"label": {"color": "white","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={PatentsKey.abstract}
                        id="abstarct"
                        placeholder="Enter your Abstract"
                        onChange={(event)=>{handleChange(event)}}
                        variant="filled"
                        />
                        <br/>
                        <TextInput
                        styles={{"label": {"color": "white","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={PatentsKey.country}
                        placeholder="Enter Country"
                        onChange={(event)=>{handleChange(event)}}
                        id="country"
                        withAsterisk
                        required
                        />
                        <br/>
                       
                        <Button
                          variant="contained"
                          color="secondary"
                          type="submit"
                          form="insert-data"
                          onClick={(event) => {
                            console.log("SUBMITTT",(designRef.current))
                            patentRef.current.setCustomValidity(titles.includes(body.pat_no)?"Patent Number Already exist":"")
                            multiSelectRef.current.setCustomValidity(cjb.length===0?"Please Select a Value.":"")
                            // designRef.current.setCustomValidity((design===""||design===null)?"Please Select A Value.":"")
                            formRef.current.reportValidity();
                            // formRef.current.submit();
                            setSend(send + 1);
                          }}
                        >
                          Submit
                        </Button>
                        {/* </MDBCol> */}
                        {/* </MDBRow> */}
                      </MDBCol>
                    </MDBRow>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
}

export default NewPatent;