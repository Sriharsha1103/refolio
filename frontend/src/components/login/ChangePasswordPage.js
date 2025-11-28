import React, { useEffect } from 'react';
import HomeNavbar from "../RNavbar";
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Changepass from './ChangePassword';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCol, MDBRow } from 'mdb-react-ui-kit';

function ChangePassword() {
  const login=useSelector(state=>state.Login)
  const loggedIn = useSelector((state)=>state.logged);
  const verify = useSelector((state)=>state.verify);
    const navigate = useNavigate();
    useEffect(()=>{
    //console.log('Hello'+login.Name)
    if(!loggedIn){
        navigate("../")}
    else if(!verify){
      navigate("../verify")
    }
    },[])
    
  return (
    
    <>
    <HomeNavbar/>
    <div class="col d-flex justify-content-center" style={{height: "90vh",
        width: "100vw",
      "backgroundColor":"#c5d299", paddingTop:"90px"}}>

      <MDBCard style={{ maxHeight: '380px', maxWidth: '900px'}}>
        <MDBRow className='g-0'>

          <MDBCol md='8'>
          <MDBCardImage src={require('../static/hompage.jpg')} fluid />
          </MDBCol>

          <MDBCol md='4' >
            <MDBCardBody style={{'display': 'flex', justifyContent: 'center',alignItems: 'center',height: '100%', width:'100%'}}>
                <Changepass/>
          {/* <MDBCardBody style={{'display': 'flex', justifyContent: 'center',alignItems: 'center',height: '100%', width:'100%'}}>
          {/* <MDBCardImage src={require('./static/bvrit-logo.jpg')} fluid /> 
            <p style={{"fontSize":"35px",'color':'#6C9449'}}>Research Publications Search Engine</p> */}
          </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>

    </div>
    {/* <div id='login_back'>
            <div id='login_fore_row'>
                <div id='login_fore_col1'> 
                    <img id='homepage_image' src={image}/>
                </div>
                <div id='login_fore_col2' > 
                    <div className='login_fore_top'>
                        <img id='logo_image' src={logo}/>
                    </div>
                    <div className='login_fore_top'>
                        <div id='text'>Research Publications Search Engine</div>
                    </div>
                    <div id='login_fore_bottom' className='Center' >
                       <center><Changepass/></center>
                    </div>
                </div>
            </div>
        </div> */}
    </>
    
  );
}

export default ChangePassword;