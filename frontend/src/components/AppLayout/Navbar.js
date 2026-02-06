import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Signout } from '../../store/Actions';
import { lightGreen } from '@mui/material/colors';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { NAV_LINKS_DEV } from '../../utils/constants';

function HomeNavbar() {
    // const clientId = 'client-ID';
    // const isAdmin = useSelector((state)=>state.isAdmin);
    const isSuperAdmin = useSelector((state)=>state.isSuperAdmin);
    const username = useSelector((state)=>state.Name);
    const loggedIn = useSelector((state)=>state.logged);
    const tab = useSelector((state)=>state.tab);
    const dispatch=useDispatch()
    const navigate = useNavigate();

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNew, setAnchorElNew] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenNewMenu = (event) => {
        setAnchorElNew(event.currentTarget);
    };

    const handleCloseNewMenu = () => {
        setAnchorElNew(null);
    };

    const logOut = () => {
        if(loggedIn){
            localStorage.clear()
            dispatch(Signout())
            navigate("/login");
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

    // Compute visible NEW links once, honoring visibility rules
    const visibleNewLinks = NAV_LINKS_DEV.filter(link => {
        const isNewItem = link.tab && link.tab.startsWith('new-');
        if (!isNewItem) return false;
        if (link.alwaysVisible) return true;
        if (!loggedIn) return false;
        if (link.requiresSuperAdmin && !isSuperAdmin) return false;
        if (link.hideForSuperAdmin && isSuperAdmin) return false;
        return true;
    });

  return (
    <AppBar position="static" color="inherit" className='NavBar' sx={{ width: '100vw', margin:0, paddingLeft: 0 }}>
      <Container maxWidth={false} >
        <Toolbar disableGutters >
          <Box component={RouterLink} to="/refolio/home" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            <img
              src={require("../../static/bvrit-logo.png")}
              width="150"
              height="50"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {NAV_LINKS_DEV.map(link => {
                // Determine visibility
                if (link.alwaysVisible) {
                    // Always show
                } else if (!loggedIn) {
                    // Not logged in, hide auth links
                    return null;
                } else if (link.requiresSuperAdmin && !isSuperAdmin) {
                    // Requires super admin but user is not
                    return null;
                } else if (link.hideForSuperAdmin && isSuperAdmin) {
                     // Hide for super admin
                    return null;
                }
                // Group "new-*" under NEW dropdown
                const isNewItem = link.tab && link.tab.startsWith('new-');
                if (isNewItem) {
                    return null; // Skip here; handled by NEW menu below
                }
                return (
                    <Link 
                        key={link.tab}
                        component={RouterLink} 
                        to={link.to} 
                        sx={navLinkStyle(link.tab)}
                    >
                        {link.label}
                    </Link>
                );
            })}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            {visibleNewLinks.length > 0 && (
                <>
                    <Button
                        id="new-menu-button"
                        onClick={handleOpenNewMenu}
                        sx={navLinkStyle('new-menu')}
                    >
                        NEW
                    </Button>
                    <Menu
                        id="new-menu"
                        anchorEl={anchorElNew}
                        open={Boolean(anchorElNew)}
                        onClose={handleCloseNewMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {visibleNewLinks.map(link => (
                            <MenuItem
                                key={link.tab}
                                component={RouterLink}
                                to={link.to}
                                onClick={handleCloseNewMenu}
                            >
                                {link.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )}
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
                        <MenuItem component={RouterLink} to="/refolio/changepassword" onClick={handleCloseUserMenu}>
                            <Typography textAlign="center">Change Password</Typography>
                        </MenuItem>
                        <MenuItem component={RouterLink} onClick={() => { handleCloseUserMenu(); logOut(); }}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <Link component={RouterLink} to="/login" sx={navLinkStyle('login')}>Login</Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default HomeNavbar;
