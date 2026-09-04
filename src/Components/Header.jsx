import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Store/authenticationReducer';
import { getStoredUser } from '../utils/storage';


export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let isAuthenticated = false;
  const auth = useSelector((state) => state.authentication || {});
  const user = auth.user || getStoredUser();
  const token = auth.token || localStorage.getItem('token');
    if(token != null){
      isAuthenticated = true;
    }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [listingMenuAnchor, setListingMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleListingMenuOpen = (event) => {
    setListingMenuAnchor(event.currentTarget);
  };

  const handleListingMenuClose = () => {
    setListingMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleUserMenuClose();
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Listing & Status', hasSubmenu: true },
    { label: 'Contact & Support', path: '/contact-support' },
    { label: 'Disclaimer', path: '/disclaimer' },
    { label: 'Registration Info', path: '/registration-info' },
  ];

  const authenticatedItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile Settings', path: '/profile-settings' },
    { label: 'Billing', path: '/billing' },
    { label: 'Chat', path: '/chat' },
  ];

  const listingSubmenu = [
    { label: 'Create Listing', path: '/create-post' },
    { label: 'All Listings', path: '/dashboard' },
    { label: 'Assigned', path: '/dashboard' },
    { label: 'Picked Up', path: '/dashboard' },
    { label: 'Delivered', path: '/dashboard' },
    { label: 'Chat', path: '/chat' },
  ];

  const handleHomeNavigation = () => {  
    //check if user is authenticated
    const token = localStorage.getItem('token');
    const isAuthenticated = Boolean(token);
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        {isMobile ? (
          <>
            <LocalShippingIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={handleHomeNavigation}
            >
              Cheap Load
            </Typography>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {menuItems.map((item) => (
                item.hasSubmenu ? (
                  listingSubmenu.map((subItem) => (
                    <MenuItem
                      key={subItem.path}
                      onClick={() => {
                        navigate(subItem.path);
                        handleMenuClose();
                      }}
                    >
                      {subItem.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      handleMenuClose();
                    }}
                  >
                    {item.label}
                  </MenuItem>
                )
              ))}
              {isAuthenticated && authenticatedItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleMenuClose();
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
              {isAuthenticated && (
                <MenuItem
                  onClick={() => {
                    navigate('/dashboard');
                    handleMenuClose();
                  }}
                >
                  Dashboard
                </MenuItem>
              )}
              {isAuthenticated && (
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Left: Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon sx={{ mr: 1 }} />
              <Typography
                variant="h6"
                component="div"
                sx={{ cursor: 'pointer' }}
                onClick={handleHomeNavigation}
              >
                Cheap Load
              </Typography>
            </Box>

            {/* Center: Nav Links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={handleHomeNavigation}>
                Home
              </Button>
              {isAuthenticated ? (<Button
                color="inherit"
                onClick={handleListingMenuOpen}
                aria-controls="listing-menu"
                aria-haspopup="true"
              >
                Listing & Status
              </Button>
              )
              : null}
              <Button color="inherit" onClick={() => navigate('/contact-support')}>
                Contact & Support
              </Button>
              <Button color="inherit" onClick={() => navigate('/disclaimer')}>
                Disclaimer
              </Button>
              <Button color="inherit" onClick={() => navigate('/registration-info')}>
                Registration Info
              </Button>
            </Box>

            {/* Right: Auth */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                 
                  <IconButton
                    color="inherit"
                    onClick={handleUserMenuOpen}
                    aria-controls="user-menu"
                    aria-haspopup="true"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="user-menu"
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                  >
                    {authenticatedItems.map((item) => (
                      <MenuItem
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          handleUserMenuClose();
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" variant="outlined" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f0f0f0' } }}
                    onClick={() => navigate('/register')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
