import {Card} from '@mantine/core'
import '../Comp.css'
import { useDispatch, useSelector} from 'react-redux'
import Login from './Log'
import Register from './Register'
import Forgot from './Forgot'
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCol, MDBRow } from 'mdb-react-ui-kit'
import HomeNavbar from '../RNavbar'
import { useEffect } from 'react'
import { Tab } from './Actions.js'


function Main(){
    const a=useSelector(state=>state.Page)
    const dispatch=useDispatch();
    useEffect(()=>{
      dispatch(Tab('login'));
    },[])
    console.log(a);
    return(
      <>
      <HomeNavbar/>
      
        <div class="col d-flex justify-content-center" style={{height: "79.5vh",
        width: "100vw",
      "backgroundColor":"#c5d299", paddingTop:"65px"}}>
      <MDBCard style={{ maxHeight: '380px', maxWidth: '900px'}}>
        <MDBRow className='g-0'>

          <MDBCol md='6'>
          <MDBCardImage style={{height:'380px'}}src={require('../static/hompage.jpg')} fluid />
          </MDBCol>

          <MDBCol md='6' >
            <MDBCardBody style={{'display': 'flex', justifyContent: 'center',alignItems: 'center',height: '100%', width:'100%'}}>
              {/* {a} */}
              {a=="Forgot"?<Forgot/>:(a=='Register'?<Register/>:<Login/>)}
          {/* <MDBCardBody style={{'display': 'flex', justifyContent: 'center',alignItems: 'center',height: '100%', width:'100%'}}>
          {/* <MDBCardImage src={require('./static/bvrit-logo.jpg')} fluid /> 
            <p style={{"fontSize":"35px",'color':'#6C9449'}}>Research Publications Search Engine</p> */}
          </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>

    </div>
    </>
        // <div id='login_back'>
        //     <div id='login_fore_row'>
        //         <div id='login_fore_col1'> 
        //             <img id='homepage_image' src={image}/>
        //         </div>
        //         <div id='login_fore_col2' > 
        //             <div className='login_fore_top'>
        //                 <img id='logo_image' src={logo}/>
        //             </div>
        //             <div className='login_fore_top'>
        //                 <div id='text'>Research Publications Search Engine</div>
        //             </div>
        //             <div id='login_fore_bottom'>
        //                 {a}
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Main;