import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import Header from '../Header';
import ChatScreen from '../Chat/ChatScreen';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import AllPosts from './AllPosts';
import FilterSidebar from './FilterSidebar';

import { startChat } from "../../utils/socketClient";
import { get_posts } from '../../Store/postReducer';

export default function AllListings() {
  const navigate = useNavigate();
  const location = useLocation();
  const postsState = useSelector((state) => state.posts || {});
  // console.log(postsState, "posts in all posts");
  const posts = postsState.posts.rows || [];
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'listing';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [toUserId, setToUserId] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const params = {};
    if (activeTab === 'assigned') params.status = 'Assigned';
    else if (activeTab === 'pickedup') params.status = 'Shipped';
    else if (activeTab === 'delivered') params.status = 'Delivered';

    dispatch(get_posts(params));
  }, [activeTab, dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChatDriver = (listing) => {
    startChat(listing.createdBy || "");
    // setActiveListing(item);
    setToUserId(listing.createdBy || "");
    // dispatch(setListingsPaneOpen(true));

    setSelectedDriver({
      name: listing.driver || 'Available Driver',
      company: listing.driverCompany || 'Transport Company',
    });
    setSelectedShipment(listing);
    setChatOpen(true);
  };

  const renderListings = (listings, statusLabel, statusFilter) => {
    if (listings.length === 0) {
      return (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No {statusLabel} shipments found
          </Typography>
        </Card>
      );
    }

    return (
      <Grid container spacing={3}>
        <AllPosts status={statusFilter} />
      </Grid>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header isAuthenticated={true} />

      <Box sx={{ display: 'flex', gap: 3, px: 2, py: 4 }}>
        {/* Fixed Sidebar - does not move with scroll */}
        <Box sx={{ flexShrink: 0 }}>
          <FilterSidebar />
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 2, flex: 1, ml: '320px' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 3 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" gutterBottom>
            Listing & Status
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Manage and track your shipment listings
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Listing" value="listing" />
              <Tab label="Assigned" value="assigned" />
              <Tab label="Picked Up" value="pickedup" />
              <Tab label="Delivered" value="delivered" />
            </Tabs>
          </Box>

          {activeTab === 'listing' && renderListings(posts, 'listing', 'listing')}
          {activeTab === 'assigned' && renderListings(posts, 'assigned', 'assigned')}
          {activeTab === 'pickedup' && renderListings(posts, 'picked up', 'pickedup')}
          {activeTab === 'delivered' && renderListings(posts, 'delivered', 'delivered')}
        </Container>
      </Box>

      {chatOpen && (
        <ChatScreen
          open={chatOpen}
          driver={selectedDriver}
          shipment={selectedShipment}
          toUserId={toUserId}
          onClose={() => setChatOpen(false)}
        />
      )}
    </Box>
  );
}