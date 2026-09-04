import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Button from '@mui/material/Button';
import Logo from '../Assets/Logo.png'
import { HeaderBackground } from '../../Constants/Colors';
import { useNavigate } from 'react-router-dom';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = [
    { name: 'Account', link: "/userdashboard1" },
    { name: 'Add Listing', link: "/addposts" },
    { name: 'Logout', action: 'logout' },
];

function UserHeader({ onLogout }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (setting) => {
        setAnchorElUser(null);
        if (!setting) return;
        if (setting.action === 'logout') {
            if (typeof onLogout === 'function') onLogout();
            return;
        }
        if (setting.link) {
            navigate(setting.link);
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: HeaderBackground }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src={Logo} style={{ display: { xs: 'none', md: 'flex' }, mr: 1, height: '80px', width: "100px" }} />


                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu> */}
                    </Box>
                    {/* ths part needs to be dynamic with the User */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: "center", justifyContent: 'center' }}>
                        <Typography sx={{ textAlign: 'center' }}> {"Welcome, Anum Jawaid "}  </Typography>

                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                👋
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
                            onClose={() => handleCloseUserMenu(null)}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.name} onClick={()=>handleCloseUserMenu(setting)}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default UserHeader;