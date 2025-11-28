import React, { useEffect, useState } from "react";
import _ from 'lodash';
// import { Form//  helperText } from "material-ui/Form";

// import Modal from 'react-bootstrap/Modal';

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";

// import HomeNavbar from "../RNavbar";
// import Modal from "react-bootstrap/Modal";

import { Button, Tooltip, Zoom, duration  } from "@mui/material";

import Service from "../../Service/http";
import {Departments, ResearchKey} from "../../Service/keyValueMap";

import { IconEdit } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { Modal,MultiSelect,TextInput, Group, Select, NumberInput} from "@mantine/core";
function EditResearch({ edit, titles }) {
  const service = new Service();
  const yearpre = new Date();
  const years = [];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }
  const formRef = React.useRef();
  const multiSelectRef = React.useRef(null);
  const designRef = React.useRef(null)
  const durationRef = React.useRef(null)
  const patentRef = React.useRef(null)

  const [design,setDesign] = useState(edit.year)
  const [duration,setDuration] = useState(edit.duration);

//   const [monthvalue, setMonthValue] = useState(edit.month);
  const [cjb, setCjb] = useState(edit.dept);
//   const [titles, setTitles] = useState(patentNo);
//   const [branch, setBranch] = useState(edit.branch);
 
 
const [body,setBody] = useState(edit)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleUpdate = () => {

    if (!_.isEqual(body,edit)) {
        patentRef.current.setCustomValidity(body.title!=edit.title && titles.includes(body.title)?"Title Already exist":"")
        multiSelectRef.current.setCustomValidity(cjb.length===0?"Please Select a Value.":"")
        durationRef.current.setCustomValidity(duration===""?"Please Enter Duration.":"")
        designRef.current.setCustomValidity((design.length===0)?"Please Select A Value.":"")
      if(formRef.current.reportValidity()){
       
          
      let confirm = window.confirm('This will update the research project.')
      if(confirm){
      service.post('api/research/update',body).then((res)=>{
        console.log("body",body)
      window.alert('Updated '+edit.title+" research project.")
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
}}
} else {
    window.alert('Make changes to Update.')
}
};
const handleShow = () => {setShow(true);};
// const navigate = useNavigate();

const handleChangeDept = (event) => {
   
    setCjb(event);
    setBody({
        _id: edit._id,
      __v: edit.__v,
            title : body.title,
            pi : body.pi,
            co_pi  : body.co_pi,
            dept : event,
            amount : body.amount,
            scheme : body.scheme,
            year : body.year,
            duration:body.duration
          });
  };
  const handleChangeDesign = (event) => {
    setDesign(event);
    // body.author_no = event.target.value
    setBody({
        _id: edit._id,
      __v: edit.__v,
        title : body.title,
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : event,
        duration:body.duration

      });
  };
  const handleDuration = (event) => {
    setDuration(event);
    setBody({
      _id: edit._id,
      __v: edit.__v,
      title : body.title,
      pi : body.pi,
      co_pi  : body.co_pi,
      dept : body.dept,
      amount : body.amount,
      scheme : body.scheme,
      year : body.year,
      duration : event
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
  setDesign(edit.year);
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
      setBody({       
        _id: edit._id,
      __v: edit.__v, 
        title : e.currentTarget.value.replace(/\s+/g, ' '),
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : body.year,
        duration:body.duration

      });
    } else if (e.currentTarget.id === "authors") {
      // body.username = e.target.value
      setBody({
        _id: edit._id,
      __v: edit.__v,
        title : body.title,
        pi : e.currentTarget.value,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : body.year,
        duration:body.duration

      });    } else if (e.currentTarget.id === "co_authors") {
      // body.name_cjb = e.target.value
      setBody({
        _id: edit._id,
      __v: edit.__v,
        title : body.title,
        pi : body.pi,
        co_pi  : e.currentTarget.value,
        dept : body.dept,
        amount : body.amount,
        scheme : body.scheme,
        year : body.year,
        duration:body.duration

      });
    } else if (e.currentTarget.id === "amount") {
      // body.vol = e.target.value
      setBody({
        _id: edit._id,
      __v: edit.__v,
        title : body.title,
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : e.currentTarget.value,
        scheme : body.scheme,
        year : body.year,
        duration:body.duration

      });
    } else{
        setBody({
            _id: edit._id,
      __v: edit.__v,
            title : body.title,
            pi : body.pi,
            co_pi  : body.co_pi,
            dept : body.dept,
            amount : body.amount,
            scheme : e.currentTarget.value,
            year : body.year,
            duration:body.duration

          });
    } 
   
    // console.log("IN HANDLE CHANGE", body)
  };
  console.log("EDIT PAT", edit)

  return (
    <>
    
      <Modal.Root opened={show} onClose={handleClose} size="100%" >
        <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <h4>
            Edit Research Project <a style={{ color: "#548C42" }}>{edit.title}</a>
            </h4>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body className="bg-green">
          <MDBContainer fluid className="">
            <MDBRow className="d-flex justify-content-center align-items-center">
              <MDBCol col="12" className="m-4">
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
                        ref={patentRef}
                        label={ResearchKey.title}
                        placeholder={ResearchKey.title}
                        defaultValue={edit.title}
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
                        defaultValue={edit.pi}
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
                        label={ResearchKey.co_pi+' (Add multiple authors seperated by ",")'}
                        defaultValue={edit.co_pi}
                        id="co_authors"
                        placeholder={ResearchKey.co_pi}
                        onChange={(event)=>{handleChange(event)}}
                        withAsterisk
                        required
                        />
                        </MDBCol>

                        <MDBCol md="6" className="bg-indigo p-5">
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
                              value={body.year} 
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
                              value={body.duration} 
                              onChange={(e)=>{handleDuration(e)}} />
                            </MDBCol>
                              
                                
                            {/* </FormControl> */}
                          
                          </MDBRow>
                          <MDBRow>
                          <MDBCol md="6">
                          <MultiSelect 
                            //   zIndex={1010}
                              ref={multiSelectRef}
                              styles={{"label": {"color": "white","text-align":"left"}}}
                              style={{"text-align":"left"}} 
                              withAsterisk 
                              //   onClick={(e) => e.stopPropagation()}
                              placeholder={cjb.length==0?"Select At least One":"Type to search"}
                              label={ResearchKey.dept} 
                              searchable 
                            //   dropdownOpened
                            defaultValue={edit.dept}
                              id = "dept"
                              data={Departments} 
                              //   value={cjb} 
                              onChange={(e)=>{handleChangeDept(e)}} />
                         
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
                        defaultValue={edit.amount}
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
                        defaultValue={edit.scheme}
                        withAsterisk
                        required
                        />
                        <br/>
                          
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
            variant="contained"
            color="error"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            style={{ marginRight: "10px" }}
            variant="contained"
            color="success"
            onClick={()=>{handleUpdate()}}
          >
            Update
          </Button>
    </Group>
</div>
                        </Modal.Content>
        {/* <Modal.Footer>
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
        </Modal.Footer> */}
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

export default EditResearch;
