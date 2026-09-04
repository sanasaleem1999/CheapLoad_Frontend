import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
   
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout';
import { get_posts } from '../../Store/postReducer';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../Header';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { resetChat } from '../../Store/chatReducer';
import { getStoredUser } from '../../utils/storage';


export default function Dashboard() {
    const auth = useSelector((state) => state.authentication || {});
    const dispatch = useDispatch();
    console.log(auth, "auth in dashboard");
    

    const user = auth.user || getStoredUser();
    const token = auth.token || localStorage.getItem('token');
    const isLoggedIn = Boolean(user || token);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // redirect to login
        navigate('/login',{ replace: true });
    };
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    useEffect(() => {
        
        dispatch(resetChat());
    }, []);


   
    return (
        <>
        <Header/>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Welcome Section */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Welcome back, {user?.name || 'User'}!
                        </Typography>
                        <Typography variant="body1" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" sx={{ color: "primary.main" }} />
                            {user?.companyLegalName ? `${user.companyLegalName}` : 'Your Company'}
                        </Typography>
                    </Box>
                   
                </Box>

                {/* Quick Actions */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' },
                            }}
                            onClick={() => navigate('/create-post')}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <AddIcon sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6">Create New Post</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' },
                            }}
                            onClick={() => navigate('/alllistings')}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <LocalShippingIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                                <Typography variant="h6">View All Listings</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' },
                            }}
                            onClick={() => navigate('/profile-settings')}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <PersonIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                                <Typography variant="h6">Profile Settings</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' },
                            }}
                            onClick={() => navigate('/chat')}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <ChatBubbleOutlineIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                                <Typography variant="h6">My Chats</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>


        </Box>
        </>
    );
}