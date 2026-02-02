import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import { useDispatch, useSelector } from 'react-redux';
import { Signout } from './login/Actions';
import { lightGreen } from '@mui/material/colors';
import { useState } from 'react';

function HomeNavbar() {
    const clientId = 'client-ID';
    const isAdmin = useSelector((state)=>state.isAdmin);
    const isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
    const username = useSelector((state)=>state.Name);
    const loggedIn = useSelector((state)=>state.logged);
    const tab = useSelector((state)=>state.tab);
    const dispatch=useDispatch()

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logOut = () => {
        if(loggedIn){
            localStorage.clear()
            dispatch(Signout())
          }
    };

    const navLinkStyle = (activeTab) => ({
        my: 2, 
        color: tab === activeTab ? "#809d38" : 'gray', 
        display: 'block',
        fontWeight: tab === activeTab ? 'bold' : 'normal',
        textDecoration: 'none',
        px: 1
    });

  return (
    <AppBar position="static" color="inherit" className='NavBar' sx={{ width: '100vw', margin:0, paddingLeft: 0 }}>
      <Container maxWidth={false} >
        <Toolbar disableGutters >
          <Box component="a" href="/refolio/home" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            <img
              src={require("./static/bvrit-logo.png")}
              width="150"
              height="50"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Link href="/refolio/home" sx={navLinkStyle('home')}>Home</Link>
            {loggedIn && (
                <>
                    <Link href="/refolio/publications" sx={navLinkStyle('publication')}>Publications</Link>
                    <Link href="/refolio/patents" sx={navLinkStyle('patent')}>Patents</Link>
                    <Link href="/refolio/research" sx={navLinkStyle('research')}>Research Projects</Link>
                    <Link href="/refolio/consultancy" sx={navLinkStyle('consultancy')}>Consultancy Projects</Link>
                    
                    {!isSuperAdmin ? (
                        <>
                            <Link href="/refolio/insertPublications" sx={navLinkStyle('new-publication')}>New Publication</Link>
                            <Link href="/refolio/insertPatents" sx={navLinkStyle('new-patent')}>New Patent</Link>
                            <Link href="/refolio/insertResearch" sx={navLinkStyle('new-research')}>New Research Project</Link>
                            <Link href="/refolio/insertConsultancy" sx={navLinkStyle('new-consultancy')}>New Consultancy Project</Link>
                        </>
                    ) : (
                        <Link href="/refolio/users" sx={navLinkStyle('users')}>Users List</Link>
                    )}
                </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {loggedIn ? (
                <>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: lightGreen[700] }} alt={username} src="/broken-image.jpg" />
                            <Typography sx={{ ml: 1, display: { xs: 'none', md: 'block' }, color: 'text.primary' }}>{username}</Typography>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem component="a" href="/refolio/changepassword" onClick={handleCloseUserMenu}>
                            <Typography textAlign="center">Change Password</Typography>
                        </MenuItem>
                        <MenuItem component="a" href="/refolio/login" onClick={() => { handleCloseUserMenu(); logOut(); }}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <Link href="/refolio/login" sx={navLinkStyle('login')}>Login</Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default HomeNavbar;
