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

import { Button, Tooltip, Zoom  } from "@mui/material";

import Service from "../../Service/http";
import {Departments, ConsultancyKey} from "../../Service/keyValueMap";

import { IconEdit } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { Modal,MultiSelect,TextInput, Group, Select} from "@mantine/core";
function EditConsultancy({ edit, titles }) {
  const service = new Service();
  const yearpre = new Date();
  const years = [];
  for (let step = 2012; step < 1 + yearpre.getFullYear(); step++) {
    years.push(step);
  }
  const formRef = React.useRef();
  const patentRef = React.useRef(null)
  const multiSelectRef = React.useRef(null);
  const designRef = React.useRef(null)


//   const [design,setDesign] = useState(edit.year)
//   const [monthvalue, setMonthValue] = useState(edit.month);
  const [cjb, setCjb] = useState(edit.dept);
//   const [titles, setTitles] = useState(patentNo);
//   const [branch, setBranch] = useState(edit.branch);
 
 const containsIgnoreCase=(array, searchString) =>{
    const lowerCaseSearch = searchString.toLowerCase();
    return array.some(item => item.toLowerCase() === lowerCaseSearch);
  }
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleUpdate = () => {

    if (!_.isEqual(body,edit)) {
        patentRef.current.setCustomValidity(body.title!=edit.title && containsIgnoreCase(titles,body.title)?"Title Already exist":"")
        multiSelectRef.current.setCustomValidity(cjb.length===0?"Please Select a Value.":"")
        designRef.current.setCustomValidity((ngo==="")?"Please Select A Value.":"")
      if(formRef.current.reportValidity()){
       
          
      let confirm = window.confirm('This will update the consultancy project.')
      if(confirm){
      service.post('api/consultancy/update',body).then((res)=>{
        console.log("body",body)
      window.alert('Updated '+edit.title+" consultancy project.")
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
const [body,setBody] = useState(edit)
const [ngo, setNGO] = useState(edit.ngo);



 
  
 
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
  setCjb(edit.dept);

    // presentYear = new Date(edit.year).getFullYear();
    // setYearvalue(presentYear);
//  setBranch(edit.branch);
//   setNational(edit.nationality);
//   setProceedings(edit.is_proceedings);
//   setPublished(edit.is_published);
//  setAffiliated(edit.is_affilated);
//  setAuthorNo(edit.author_no);
  },[edit])
  const handleChangeDesign = (event) => {
    setNGO(event)
    setBody({
      _id: edit._id,
      __v: edit.__v,
      title : body.title,
      industry: body.industry,
      ngo : event,
      pi : body.pi,
      co_pi  : body.co_pi,
      dept : body.dept,
      amount : body.amount,
        });
  }
  const handleChangeDept = (event) => {
   
    setCjb(event);
    setBody({
        _id: edit._id,
      __v: edit.__v,
        title : body.title,
        industry: body.industry,
        ngo : body.ngo,
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : event,
        amount : body.amount,
          });
  };
  const handleChange = (e) => {
    console.log("EEEE", e)
   if (e.currentTarget.id === "title") {
      // body.title = e.target.value
      setBody({  
        _id: edit._id,
      __v: edit.__v,      
        title : e.currentTarget.value.replace(/\s+/g, ' '),
        industry: body.industry,
        ngo : body.ngo,
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
      });
    } else if (e.currentTarget.id === "authors") {
      // body.username = e.target.value
      setBody({
        _id: edit._id,
      __v: edit.__v,
        title : body.title,
        industry: body.industry,
        ngo : body.ngo,
        pi : e.currentTarget.value,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : body.amount,
      });    } else if (e.currentTarget.id === "co_authors") {
      // body.name_cjb = e.target.value
      setBody({
        _id: edit._id,
      __v: edit.__v,
        title : body.title,
        industry: body.industry,
        ngo : body.ngo,
        pi : body.pi,
        co_pi  : e.currentTarget.value,
        dept : body.dept,
        amount : body.amount,
      });
    } else if (e.currentTarget.id === "amount") {
      // body.vol = e.target.value
      setBody({
        _id: edit._id,
      __v: edit.__v,
        title : body.title,
        industry: body.industry,
        ngo : body.ngo,
        pi : body.pi,
        co_pi  : body.co_pi,
        dept : body.dept,
        amount : e.currentTarget.value,
      });
    } else if(e.currentTarget.id==="ngo"){
        setBody({
            _id: edit._id,
      __v: edit.__v,
            title : body.title,
            industry: body.industry,
            ngo : e.currentTarget.value,
            pi : body.pi,
            co_pi  : body.co_pi,
            dept : body.dept,
            amount : body.amount,
          });
    }else{
        setBody({
            _id: edit._id,
      __v: edit.__v,
            title : body.title,
            industry: e.currentTarget.value,
            ngo : body.ngo,
            pi : body.pi,
            co_pi  : body.co_pi,
            dept : body.dept,
            amount : body.amount,
        })
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
            Edit Consultancy Project <a style={{ color: "#548C42" }}>{edit.title}</a>
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
                        label={ConsultancyKey.title}
                        placeholder={ConsultancyKey.title}
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
                        label={ConsultancyKey.pi+'  (Add multiple authors seperated by ",")'}
                        defaultValue={edit.pi}
                        id="authors"
                        placeholder={ConsultancyKey.pi}
                        onChange={(event)=>{handleChange(event)}}
                        withAsterisk
                        required
                        />
                        <br />
                        <TextInput
                        styles={{"label": {"color": "#6C9449","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={ConsultancyKey.co_pi+'  (Add multiple authors seperated by ",")'}
                        defaultValue={edit.co_pi}
                        id="co_authors"
                        placeholder={ConsultancyKey.co_pi}
                        onChange={(event)=>{handleChange(event)}}
                        withAsterisk
                        required
                        />
                        </MDBCol>

                        <MDBCol md="6" className="bg-indigo p-5">
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
                              label={ConsultancyKey.dept} 
                              searchable 
                            //   dropdownOpened
                            defaultValue={edit.dept}
                              id = "dept"
                              data={Departments} 
                              //   value={cjb} 
                              onChange={(e)=>{handleChangeDept(e)}} />
                                
                            {/* </FormControl> */}
                          </MDBCol>

                          <MDBCol md="6">
                          <Select 
                               ref={designRef}
                              styles={{"label": {"color": "white","text-align":"left"}}}
                              style={{"text-align":"left"}} 
                              withAsterisk 
                              placeholder="Select One"
                              label={ConsultancyKey.ngo} 
                              searchable 
                              // maxValues={2}
                              id = "ngo"
                              data={["Private","Public","NGO"]} 
                              value={body.ngo} 
                              onChange={(e)=>{handleChangeDesign(e)}} />
                          </MDBCol>
                        </MDBRow>
                        <br/>
                        <TextInput
                        styles={{"label": {"color": "white","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={ConsultancyKey.industry}
                        placeholder="Enter Industry"
                        onChange={(event)=>{handleChange(event)}}
                        id="industry"
                        defaultValue={edit.industry}
                        withAsterisk
                        required
                        />
                        <br/>
                        <TextInput
                        styles={{"label": {"color": "white","text-align":"left"}}}
                        style={{"text-align":"left"}}
                        label={ConsultancyKey.amount}
                        placeholder="Enter Amount"
                        onChange={(event)=>{handleChange(event)}}
                        id="amount"
                        withAsterisk
                        defaultValue={edit.amount}
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

export default EditConsultancy;
