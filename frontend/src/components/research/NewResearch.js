import React, { useEffect, useState } from "react";

// import Select from "@mui/material/Select";
import { DateInput } from "@mantine/dates";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../RNavbar";

import { Button } from '@mui/material';
import Service from '../../Service/http';
import { Departments, ResearchKey } from '../../Service/keyValueMap';
import { useDispatch, useSelector } from 'react-redux';
import { MultiSelect,TextInput, Textarea,Select, NumberInput } from "@mantine/core";
import { Tab } from "../login/Actions";
// import { PatentsBulkUpload } from "./PatentsBulkUpload";
// import { events } from "../../../backend/db/LoginSchema";


function NewResearch() {
  // const classes = useStyles();
  const yearpre = new Date();
  const years = [];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }
  const loggedIn = useSelector((state)=>state.logged);
  const verify = useSelector((state)=>state.verify);
  const dispatch=useDispatch();
  const isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
  const isAdmin = useSelector((state)=>state.isAdmin);
  const service = new Service();
  const multiSelectRef = React.useRef(null);
  const designRef = React.useRef(null)
  const durationRef = React.useRef(null)
  const patentRef = React.useRef(null)

   // console.log("HERE", here)
  // const username = query.get('')
  const formRef = React.useRef();
  const [design,setDesign] = useState("")
  const [body, setBody] = useState({
    title : "",
    pi : "",
    co_pi  : "",
    dept : [],
    amount : "",
    scheme : "",
    year : [],
    duration : 0
  });

  const [cjb, setCjb] = useState([]);
  const [titles, setTitles] = useState([]);
  const [send, setSend] = useState(0);
  const [show, setShow] = useState(false);
  const [duration,setDuration] = useState("");

  const navigate = useNavigate();

  const handleChangeDept = (event) => {
   
    setCjb(event);
    setBody({
        
            title : body.title,
            pi : body.pi,
            co_pi  : body.co_pi,
            dept : event,
            amount : body.amount,
            scheme : body.scheme,
            year : body.year,
        duration : body.duration

          });
  };
  const handleChangeDesign = (event) => {
    setDesign(event);
    // body.author_no = event.target.value
    setBody({
        title : body.title,
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : event,
        duration : body.duration

      });
  };
  const handleDuration = (event) => {
    setDuration(event);
    setBody({
      title : body.title,
      pi : body.pi,
      co_pi  : body.co_pi,
      dept : body.dept,
      amount : body.amount,
      scheme : body.scheme,
      year : body.year,
      duration : event

    });
  }
  
  const onSubmit = (event) => {
    console.log("HERE sub",event)
    
    if(body.year==""||body.year==null){
      window.alert('Select Year')
      event.preventDefault()
    }
    else{
        // designRef.current.setCustomValidity((design===""||design===null)?"Please Select A Value.":"")
        
      let confirm = window.confirm("This action will add the data into the Database")
      if(confirm){
    service
      .post("api/research/data", body)
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
      setBody({        
        title : e.currentTarget.value.replace(/\s+/g, ' '),
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : body.year,
        duration : body.duration

      });
    } else if (e.currentTarget.id === "authors") {
      // body.username = e.target.value
      setBody({
        
        title : body.title,
        pi : e.currentTarget.value,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : body.year,
        duration : body.duration

      });    } else if (e.currentTarget.id === "co_authors") {
      // body.name_cjb = e.target.value
      setBody({
        
        title : body.title,
        pi : body.pi,
        co_pi  : e.currentTarget.value,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : body.year,
        duration : body.duration

      });
    } else if (e.currentTarget.id === "amount") {
      // body.vol = e.target.value
      setBody({
        
        title : body.title,
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : e.currentTarget.value,
        scheme : body.scheme,
        year : body.year,
        duration : body.duration
      });
    }else if(e.currentTarget.id === "duration"){
      setBody({
        
        title : body.title,
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : body.year,
        duration: e.currentTarget.value
      });
    } else{
        setBody({
            title : body.title,
            pi : body.pi,
            co_pi  : body.co_pi,
            dept : body.dept,
            amount : body.amount,
            scheme : e.currentTarget.value,
            year : body.year,
        duration : body.duration
          });
    } 
   
    // console.log("IN HANDLE CHANGE", body)
  };
  // const navigate = useNavigate();
    useEffect(()=>{
      dispatch(Tab('new-research'));
      if(!loggedIn){
          navigate("../")}
      else if(!verify){
        navigate("../verify")
      }else if(isSuperAdmin){
        navigate("../research")
      }
      if(titles.length==0){
      service.get('api/research/titles').then((res)=>{
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
          height: "81.5vh",
          width: "100wh",
          backgroundColor: "#c5d299",
          // paddingBottom: "5",
        }}
      >
        {/* <br/> */}
        <MDBContainer fluid className="h-custom">
          <MDBRow className="h-100">
            <MDBCol col="12" className="m-4">
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
                          Research Project Information
                        </h3>
                        <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        ref={patentRef}
                        label={ResearchKey.title}
                        placeholder={ResearchKey.title}
                        onChange={(event)=>{handleChange(event)}}
                        id="title"
                        withAsterisk
                        required
                        />
                        <br />
                        <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={ResearchKey.pi+'  (Add multiple authors seperated by ",")'}
                        id="authors"
                        placeholder={ResearchKey.pi}
                        onChange={(event)=>{handleChange(event)}}
                        withAsterisk
                        required
                        />
                        <br />
                        <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={ResearchKey.co_pi+'  (Add multiple authors seperated by ",")'}
                        id="co_authors"
                        placeholder={ResearchKey.co_pi}
                        onChange={(event)=>{handleChange(event)}}
                        withAsterisk
                        required
                        />
                        {/* <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={ResearchKey.pat_no}
                        placeholder={ResearchKey.pat_no}
                        onChange={(event)=>{handleChange(event)}}
                        id="pat_no"
                        withAsterisk
                        required
                        /> */}
                        <br />
                      </MDBCol>

                      <MDBCol md="6" className="bg-indigo p-5">
                        <br/>
                        <br/>
                      <MDBRow>
                                          <MDBCol md="6">
                          <Select 
                               ref={designRef}
                              styles={{"label": {"color": "white","text-align":"left"}}}
                              style={{"text-align":"left"}} 
                              withAsterisk 
                              placeholder="Select One"
                              label={ResearchKey.year} 
                              searchable 
                              // maxValues={2}
                              id = "year"
                              data={years} 
                            //   value={cjb} 
                              onChange={(e)=>{handleChangeDesign(e)}} />
                          </MDBCol>
                          <MDBCol md="6">
                          <NumberInput 
                               ref={durationRef}
                              styles={{"label": {"color": "white","text-align":"left"}}}
                              style={{"text-align":"left"}} 
                              withAsterisk 
                              placeholder={"Enter Duration"}
                              label={ResearchKey.duration} 
                              id = "duration"
                            //   value={cjb} 
                              onChange={(e)=>{handleDuration(e)}} />
                          </MDBCol>
                        </MDBRow>
                        <br />
                        <MDBRow>
                          <MDBCol md="6">
                              <MultiSelect 
                               ref={multiSelectRef}
                              styles={{"label": {"color": "white","text-align":"left"}}}
                              style={{"text-align":"left"}} 
                              withAsterisk 
                              placeholder={cjb.length==0?"Select At least One":"Type to search"}
                              label={ResearchKey.dept} 
                              searchable 
                              id = "dept"
                              data={Departments} 
                              value={cjb} 
                              onChange={(e)=>{handleChangeDept(e)}} />
                                
                            {/* </FormControl> */}
                          </MDBCol>
                          <MDBCol md="6">
                        <TextInput
                        styles={{"label": {"color": "white","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={ResearchKey.amount}
                        placeholder="Enter Amount"
                        onChange={(event)=>{handleChange(event)}}
                        id="amount"
                        withAsterisk
                        required
                        />
                        </MDBCol>
                        </MDBRow>
                        <br/>
                        <TextInput
                        styles={{"label": {"color": "white","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={ResearchKey.scheme}
                        placeholder="Enter Scheme"
                        onChange={(event)=>{handleChange(event)}}
                        id="scheme"
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
                            patentRef.current.setCustomValidity(titles.includes(body.title)?"Title Already exist":"")
                            multiSelectRef.current.setCustomValidity(cjb.length===0?"Please Select a Value.":"")
                            durationRef.current.setCustomValidity(duration===""?"Please Enter Duration.":"")
                            designRef.current.setCustomValidity((design==="")?"Please Select A Value.":"")
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

export default NewResearch;