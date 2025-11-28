import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import _ from 'lodash';
import {notifications, showNotification ,useNotifications} from '@mantine/notifications';
// import { Form//  helperText } from "material-ui/Form";

// import Modal from 'react-bootstrap/Modal';
import MenuItem from "@mui/material/MenuItem";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

// import HomeNavbar from "../RNavbar";
// import Modal from "react-bootstrap/Modal";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { ActionIcon, Center } from "@mantine/core";
import { Button, Tooltip, Zoom  } from "@mui/material";
import HomeNavbar from "../RNavbar";
import Service from "../../Service/http";
import {Departments, PatentsKey} from "../../Service/keyValueMap";
import { useNavigate } from "react-router-dom";
import { IconEdit } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { MultiSelect,TextInput, Textarea,Select, NumberInput, Group, Modal, ScrollArea } from "@mantine/core";
function EditPatent({ edit, patentNo }) {
  const service = new Service();

  
  const formRef = React.useRef();
  const multiSelectRef = React.useRef(null);
  const designRef = React.useRef(null)
  const patentRef = React.useRef(null)

  const [design,setDesign] = useState(edit.design_utility)
//   const [monthvalue, setMonthValue] = useState(edit.month);
  const [cjb, setCjb] = useState(edit.cjb);
//   const [titles, setTitles] = useState(patentNo);
//   const [branch, setBranch] = useState(edit.branch);
 
 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleUpdate = () => {

    if (!_.isEqual(body,edit)) {
      patentRef.current.setCustomValidity(String(body.pat_no)!=edit.pat_no && (patentNo.includes(String(body.pat_no)))?"Patent Number Already exist":"")
      multiSelectRef.current.setCustomValidity(cjb.length===0?"Please Select a Value.":"")
      if(formRef.current.reportValidity()){
        if(body.design_utility==""||body.design_utility==null){
            window.alert('Select Design or Utility')
            // event.preventDefault()
          }
          else{
      
      let confirm = window.confirm('This will update the patent.')
      if(confirm){
      service.post('api/patents/update',body).then((res)=>{
     
      window.alert('Updated '+edit.title+" Patent.")
      // setShow(false)
        // console.log("RES",res)
        window.location.reload()
        handleClose();

      }).catch((err)=>{
        window.alert('Error While Updating '+edit.title+".\nPlease Try Again Later.")
        console.log("ERR",err)

    })

}else{
    window.alert("Cancelled the update action."); 
}}}
} else {
    window.alert('Make changes to Update.')
}
};
const handleShow = () => {setShow(true);};
// const navigate = useNavigate();
const [body,setBody] = useState(edit)

const handleChangeDept = (event) => {
   
    setCjb(event);
    setBody({
      _id: edit._id,
      __v: edit.__v,
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
      _id: edit._id,
      __v: edit.__v,
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
      _id: edit._id,
      __v: edit.__v,
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
      _id: edit._id,
      __v: edit.__v,
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
      _id: edit._id,
      __v: edit.__v,
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
      _id: edit._id,
      __v: edit.__v,
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
    // console.log("ONSUBMIT-------", body)
    // // // debug();
    // // setInterval(() => {
    //     // console.log('Logs every minute');
    // //   },10000)
    // service.post('api/data', body).then((json) => {
    //     console.log("JSON", json)
    //     navigate(-1)
    // }).catch((error) => {
    //     console.log(error);
    // });
    // console.log("EVENT",body)
  };
  useEffect(()=>{
    // const [body,setBody] = useState(edit)
    setBody(edit);
    // presentYear = new Date(edit.year).getFullYear();
    // setYearvalue(presentYear);
  setCjb(edit.dept);
  setDesign(edit.design);
//  setBranch(edit.branch);
//   setNational(edit.nationality);
//   setProceedings(edit.is_proceedings);
//   setPublished(edit.is_published);
//  setAffiliated(edit.is_affilated);
//  setAuthorNo(edit.author_no);
  },[edit])
  const handleChange = (e) => {
    console.log("EEEE", e)
   if (e.currentTarget.id === "title") {
      // body.title = e.target.value
      console.log(e.currentTarget.value)
      setBody({
        _id: edit._id,
      __v: edit.__v,
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
        _id: edit._id,
      __v: edit.__v,
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
        _id: edit._id,
      __v: edit.__v,
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
        _id: edit._id,
      __v: edit.__v,
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
          _id: edit._id,
      __v: edit.__v,
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
  console.log("EDIT PAT", edit)

  return (
    <>
    
      <Modal.Root opened={show} onClose={handleClose} size="100%" lockScroll={true}>
        <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <h4>
            Edit Patent <a style={{ color: "#548C42" }}>{edit.title}</a>
            </h4>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body className="bg-green" >
          <MDBContainer fluid>
            <MDBRow className="d-flex justify-content-center align-items-center">
              <MDBCol col="12" className="m-5">
                <MDBCard
                  className="card-registration card-registration-2"
                  style={{ borderRadius: "15px" }}
                >
                  <MDBCardBody className="p-0">
                    <form id="insert-data" ref={formRef} onSubmit={onSubmit}>
                      <MDBRow>
                        <MDBCol md="6" className="p-5 bg-white">
                          {/* <h3 className="fw-normal mb-5" style={{ color: '#6C9449' }}>PatentsKey Information</h3> */}
                          <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={PatentsKey.title}
                        placeholder={PatentsKey.title}
                        onChange={(event)=>{handleChange(event)}}
                        defaultValue={edit.title}
                        id="title"
                        withAsterisk
                        required
                        />
                        <br/>
                          <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={PatentsKey.authors+'  (Add multiple authors seperated by ",")'}
                        id="authors"
                        placeholder={PatentsKey.authors}
                        defaultValue={edit.authors}
                        onChange={(event)=>{handleChange(event)}}
                        withAsterisk
                        required
                        />
                        <br/>
                          <TextInput
                        ref={patentRef}
                         label={PatentsKey.pat_no} 
                         placeholder="Enter A valid Patent Number" 
                         defaultValue={edit.pat_no}
                         onChange={(event)=>{handleChange(event)}}
                         id="pat_no"
                        withAsterisk
                        required
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                         />
                         <br/>
                          <MDBRow>
                          <MDBCol md="6">
                           
                              <MultiSelect 
                               ref={multiSelectRef}
                              styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                              style={{"text-align":"left"}} 
                              withAsterisk 
                              placeholder="Select At least One" 
                              label={PatentsKey.dept} 
                              defaultValue={edit.dept}
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
      defaultValue={edit.design_utility}
      placeholder="Select One"
      data={['Design','Utility']}
      value={design}
      onChange={(e)=>{handleChangeDesign(e)}}
    //   withAsterisk
      required
    />
                           
                          </MDBCol>
                        </MDBRow>
                        </MDBCol>

                        <MDBCol md="6" className="bg-indigo p-5">

                        <MDBRow>
                            <MDBCol md="4">
                                <DateInput defaultValue={edit.filed?new Date(edit.filed):null} variant="filled" styles={{"label": {"color": "white","text-align":"left"}}}
                          style={{"text-align":"left"}} minDate={new Date("01-01-2012")}
      maxDate={new Date()} withAsterisk required label={PatentsKey.filed} valueFormat="DD MMM YYYY" placeholder="Select Date" onChange={(e)=>{handleChangeFiled(e);}}/>
                            </MDBCol>
                            <MDBCol md="4">
                                <DateInput defaultValue={edit.published?new Date(edit.published):null} variant="filled" styles={{"label": {"color": "white","text-align":"left"}}}
                          style={{"text-align":"left"}} minDate={new Date("01-01-2012")}
      maxDate={new Date()}valueFormat="DD MMM YYYY" label={PatentsKey.published} placeholder="Select Date" onChange={(e)=>{handleChangePublished(e);}}/>
                            </MDBCol>
                            <MDBCol md="4">
                                <DateInput defaultValue={edit.year?new Date(edit.year):null} variant="filled" styles={{"label": {"color": "white","text-align":"left"}}}
                          style={{"text-align":"left"}} minDate={new Date("01-01-2012")}
      maxDate={new Date()} valueFormat="DD MMM YYYY" label={PatentsKey.year} placeholder="Select Date" onChange={(e)=>{handleChangeYear(e);}}/>
                            </MDBCol>
                        </MDBRow>
                        <br/>
                        <Textarea
                        styles={{"label": {"color": "white","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={PatentsKey.abstract}
                        id="abstarct"
                        placeholder="Enter your Abstract"
                        onChange={(event)=>{handleChange(event)}}
                        variant="filled"
                        defaultValue={edit.abstract}
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
                        defaultValue={edit.country}
                        required
                        />

                          
                          {/* <MDBCheckbox name='flexCheck' id='flexCheckDefault' labelClass='text-white mb-4' label='' /> */}
                          {/* <MDBBtn color='light' size='lg'>Publish insert</MDBBtn> */}
                          {/* <MDBRow> */}

                          {/* <MDBCol md='6'>
                        <Button variant='contained' color='warning' onClick={handleShow}>Help</Button>
                        </MDBCol> */}
                          {/* <MDBCol md='6'> */}
                          {/* <Button variant="contained" color='secondary' type='submit' form="insert-data" onClick={() => { formRef.current.reportValidity(); setSend(send + 1) }}>Submit</Button> */}
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
        </Modal.Body>
        {/* <Modal.Footer> */}
        <div style={{position: "sticky",
          bottom:"0",
  left:"0",
  right:"0",
  background:"white",
  zIndex: 10,
  margin:"10px"
}}>
    <Group justify="flex-end">  
          <Button
            style={{ marginRight: "10px" }}
            variant="contained"
            color="error"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            variant="contained"
            color="success"
            onClick={()=>{handleUpdate()}}
          >
            Update
          </Button>
          </Group>
          </div>
        {/* </Modal.Footer> */}
        </Modal.Content>
      </Modal.Root>
      {/* <TooltipFloating label={"Edit"} position="top"> */}

      <Tooltip arrow title="Edit" placement="top" TransitionComponent={Zoom}>

      <IconEdit onClick={() => {
        handleShow();
      }}color="white" className="button-edit" size={23} />
      </Tooltip>
        {/* <ActionIcon
          
          size={25}
          // className="button-edit"
          variant="default"
        > */}
        {/* </ActionIcon> */}
      {/* </TooltipFloating> */}

      {/* <div style={{ "height": "fill", "width": "100wh", backgroundColor: "#c5d299", "paddingBottom": "100px" }}>
                
            </div> */}
    </>
  );
}

export default EditPatent;
