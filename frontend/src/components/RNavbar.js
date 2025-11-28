import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { Signout } from './login/Actions';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { green, lightGreen } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
//import { GoogleLogin, GoogleLogout } from 'react-google-login';

function HomeNavbar() {
    const clientId = 'client-ID';
    const isAdmin = useSelector((state)=>state.isAdmin);
    const isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
    const username = useSelector((state)=>state.Name);
    const loggedIn = useSelector((state)=>state.logged);
    const tab = useSelector((state)=>state.tab);
    const dispatch=useDispatch()
    const logOut = () => {
        if(loggedIn){
            localStorage.clear()
            dispatch(Signout())
          }
    
};

  return (
    <>
      <Navbar className='NavBar'>
        <Container>
          <Navbar.Brand href="/home"><img
              src={require("./static/bvrit-logo.png")}
              width="150"
              height="50"
              className="d-inline-block align-top"
            /></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/home" style={{"fontWeight":tab=='home'?'bold':'normal',color:tab=='home'?"#809d38":"gray"}}>Home</Nav.Link>
          { loggedIn?<><Nav.Link href="/publications" style={{"fontWeight":tab=='publication'?'bold':'normal',color:tab=='publication'?"#809d38":"gray"}}>Publications</Nav.Link>
          <Nav.Link href="/patents"style={{"fontWeight":tab=='patent'?'bold':'normal',color:tab=='patent'?"#809d38":"gray"}}>Patents</Nav.Link>
          <Nav.Link href="/research"style={{"fontWeight":tab=='research'?'bold':'normal',color:tab=='research'?"#809d38":"gray"}}>Research Projects</Nav.Link>
          <Nav.Link href="/consultancy"style={{"fontWeight":tab=='consultancy'?'bold':'normal',color:tab=='consultancy'?"#809d38":"gray"}}>Consultancy Projects</Nav.Link>
          {!isSuperAdmin?(<><Nav.Link href="/insertPublications" style={{"fontWeight":tab=='new-publication'?'bold':'normal',color:tab=='new-publication'?"#809d38":"gray"}}>New Publication</Nav.Link><Nav.Link href="/insertPatents"style={{"fontWeight":tab=='new-patent'?'bold':'normal',color:tab=='new-patent'?"#809d38":"gray"}}>New Patent</Nav.Link><Nav.Link href="/insertResearch" style={{"fontWeight":tab=='new-research'?'bold':'normal',color:tab=='new-research'?"#809d38":"gray"}}>New Research Project</Nav.Link><Nav.Link href="/insertConsultancy" style={{"fontWeight":tab=='new-consultancy'?'bold':'normal',color:tab=='new-consultancy'?"#809d38":"gray"}}>New Consultancy Project</Nav.Link></>):<Nav.Link href="/users" style={{"fontWeight":tab=='users'?'bold':'normal',color:tab=='users'?"#809d38":"gray"}}>Users List</Nav.Link>}</>:<></>}
          </Nav>
          <Nav>
            {/* <Nav.Link>

          <Dropdown>
      <Dropdown.Toggle  id="dropdown-basic">
        
         
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          <Nav.Link </Nav.Link>
          </Dropdown.Item>
        <Dropdown.Item >
          <Nav.Link</Nav.Link>
          </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </Nav.Link> */}
             {loggedIn?<Stack direction="row" spacing={1}>
                <Avatar
                sx={{ bgcolor: lightGreen[700] }}
                alt={username}
                src="/broken-image.jpg"
              />
            <NavDropdown
              id="nav-dropdown-dark-example"
              title={username}
              menuVariant="light"

            >
              <NavDropdown.Item href="/changepassword">Change Password
              </NavDropdown.Item>
              <NavDropdown.Item  href="/"onClick={logOut}>Logout</NavDropdown.Item>
            </NavDropdown>
            </Stack>:
            <Nav.Link href="/login"style={{"fontWeight":tab=='login'?'bold':'normal',color:tab=='login'?"#809d38":"gray"}}>Login</Nav.Link>
          }
          </Nav>
          
        </Container>
      </Navbar>
    </>
  );
}

export default HomeNavbar;
