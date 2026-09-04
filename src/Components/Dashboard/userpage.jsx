import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { background,Dashboardbackground ,primaryColor, HeaderBackground } from '../../Constants/Colors';
import UserHeader from './userHeader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { getStoredUser } from '../../utils/storage';

export default function UserDashboard() {

    React.useEffect(()=>{
        console.log("User Dashboard - Central Dispatch");
    },[])
   const navigate = useNavigate();
     const auth = useSelector((state) => state.authentication || {});
     console.log(auth, "auth in dashboard");
     const postsState = useSelector((state) => state.posts || {});
   
     const user = auth.user || getStoredUser();
     const token = auth.token || localStorage.getItem('token');
     console.log(token, "token in dashboard");
     const isLoggedIn = Boolean(user || token);
   
     const handleLogout = () => {
       localStorage.removeItem('user');
       localStorage.removeItem('token');
       // redirect to login
       navigate('/login');
     };
     // 🧩 Styled card component
     const Item = styled(Paper)(({ theme }) => ({
       backgroundColor: background,
       padding: theme.spacing(4),
       textAlign: 'center',
       color: '#1A2027',
       height: '100%',
       display: 'flex',
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'center',
       borderRadius: '16px',
       boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
       transition: 'all 0.3s ease',
       cursor: 'pointer',
       '&:hover': {
         transform: 'translateY(-4px)',
         boxShadow: '0 10px 18px rgba(0,0,0,0.15)',
       },
     }));
   
     // 🔹 Sample dynamic data
     const cards = [
       {
         icon: <ViewInArIcon sx={{ fontSize: 50, mb: 1,color:primaryColor}} />,
         name: 'Active Listings',
         link: '/allListings',
         helper: 'Your current active listings',
       },
       {
         icon: <DashboardIcon sx={{ fontSize: 50, mb: 1,color:primaryColor }} />,
         name: 'Create Post',
         link: '/addposts',
         helper: 'Create a new shipment post',
       },
       {
         icon: <ViewInArIcon sx={{ fontSize: 50, mb: 1,color:primaryColor }} />,
         name: 'View Listings',
         link: '/allListings',
         helper: 'View all available listings',
       },
       {
         icon: <ChatBubbleOutlineIcon sx={{ fontSize: 50, mb: 1, color: primaryColor }} />,
         name: 'Chat',
         link: '/chat',
         helper: 'Message shippers and carriers',
       },
     ];
  
   
     return (
       <React.Fragment>
         <CssBaseline />
         <Box sx={{ backgroundColor: Dashboardbackground, minHeight: '100vh' }}>
           {/* show user header when logged in */}
           {isLoggedIn && <UserHeader onLogout={handleLogout} />}
   
           {/* Hero / Title */}
           <Box sx={{ pt: 6, pb: 2, textAlign: 'center' }}>
             <Typography variant="h4" sx={{ fontWeight: 800, color: primaryColor, fontFamily: 'serif' }}>
               Dashboard
             </Typography>
             <Typography variant="subtitle1" sx={{ color: '#47547a', mt: 1 }}>
               Quick actions and overview of your account
             </Typography>
             {isLoggedIn && (
               <Typography variant="body1" sx={{ color: '#374151', mt: 1 }}>
                 Welcome back, {'User'}
               </Typography>
             )}
            {/* Quick link to Filter/Search page */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Link to="/filterSidebar" style={{ textDecoration: 'none' }}>
                <Button variant="contained" sx={{ backgroundColor: primaryColor, color: '#fff' }}>Search Listings</Button>
              </Link>
              <Link to="/addposts" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" sx={{ color: primaryColor }}>Create Post</Button>
              </Link>
            </Box>
           </Box>
   
           {/* Cards row */}
           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', px: 4, pb: 8 }}>
             <Grid container spacing={4} justifyContent="center" alignItems="stretch" maxWidth="lg">
               {cards.map((card, index) => (
                 <Grid item xs={12} sm={6} md={4} key={index}>
                   <Link to={card.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <Item>
                       {card.icon}
                       <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                         {card.name}
                       </Typography>
                       <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                         {card.helper}
                       </Typography>
                       <Box sx={{ mt: 'auto', width: '100%' }}>
                         <Button variant="contained" sx={{ backgroundColor: primaryColor, color: '#fff', width: '100%' }}>
                           Open
                         </Button>
                       </Box>
                     </Item>
                   </Link>
                 </Grid>
               ))}
             </Grid>
           </Box>
           {/* User's posts summary */}
           {isLoggedIn && (() => {
             const recentPosts = Array.isArray(postsState.posts) ? postsState.posts : postsState.posts?.rows || [];
             return (
               <Box sx={{ px: 4, pb: 8 }}>
                 <Typography variant="h6" sx={{ mb: 2 }}>Your Listings</Typography>
                 <Grid container spacing={2}>
                   {recentPosts.slice(0,3).map((post, i) => (
                     <Grid item xs={12} md={4} key={i}>
                       <Paper sx={{ p:2, borderRadius: 2 }}>
                         <Typography sx={{ fontWeight: 700 }}>{post.title || post.trailerType || 'Shipment'}</Typography>
                         <Typography variant="body2" sx={{ color: '#6b7280' }}>{post.price ? `$${post.price}` : ''}</Typography>
                       </Paper>
                     </Grid>
                   ))}
                   {(recentPosts.length === 0) && (
                     <Grid item xs={12}>
                       <Typography variant="body2" sx={{ color: '#6b7280' }}>No listings found. Create your first post from Create Post.</Typography>
                     </Grid>
                   )}
                 </Grid>
               </Box>
             );
           })()}
         </Box>
       </React.Fragment>
  );
}
