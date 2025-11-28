import React, { useEffect } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBCardTitle,

}

from 'mdb-react-ui-kit';
import HomeNavbar from "./RNavbar";
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Notifications, showNotification } from '@mantine/notifications';
import Footer from './Footer';
import { Tab } from './login/Actions';


function Home() {
  // const login=useSelector(state=>state.Login)
  const loggedIn = useSelector((state)=>state.logged);
  const verify = useSelector((state)=>state.verify);
  const dispatch=useDispatch();

    const navigate = useNavigate();
    useEffect(()=>{
      dispatch(Tab('home'));
      console.log("LOGGED IN",loggedIn,verify)
   
    if(loggedIn && !verify){
      navigate("../verify")
    }
    })
  
  // if(loggedIn){
  return (
    <>
    <HomeNavbar/>
    
    <div class="col d-flex justify-content-center" style={{height: "79.5vh",
        width: "100vw",
      "backgroundColor":"#c5d299", paddingTop:"35px"}}>
      <MDBCard style={{ maxHeight: '450px', maxWidth: '1200px'}}>
        <MDBRow className='g-0'>

          <MDBCol md='8'>
          <MDBCardImage style={{height:'450px',width:'800px'}}src={require('./static/hompage.jpg')} fluid />
          </MDBCol>

          <MDBCol md='4' >
          <MDBCardBody style={{'display': 'flex', justifyContent: 'center',alignItems: 'center',height: '100%', width:'100%'}}>
          {/* <MDBCardImage src={require('./static/bvrit-logo.jpg')} fluid /> */}
            <p style={{"fontSize":"35px",'color':'#6C9449'}}>Research Publications Search Engine</p>
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
                    <div id='login_fore_bottom' className='welcome' >
                        Hello Miss
                        <br/>
                        {localStorage.getItem('Name')}
                    </div>
                </div>
            </div>
        </div> */}
      {/* <Footer/> */}
    </>
  
  )};


export default Home;