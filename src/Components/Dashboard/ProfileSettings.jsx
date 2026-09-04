import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
// import Header from './Header';
import PersonIcon from '@mui/icons-material/Person';
import Header from '../Header';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useDispatch, useSelector } from 'react-redux';
import { get_mydetails, update_password } from '../../Store/authenticationReducer';
import { update_user } from '../../Store/userReducer';
import { getStoredUser } from '../../utils/storage';


export default function ProfileSettings() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const currentUser = useSelector((state) => state.authentication?.user) || getStoredUser();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    companyLegalName: currentUser?.companyLegalName || '',
    phone: currentUser?.businessPhone || '',
    address: currentUser?.companyAddress || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    zipCode: currentUser?.zipCode || '',
    country: currentUser?.country || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(update_user({
        id: formData._id || currentUser?.id,
        ...formData
      })).unwrap();
      alert('Profile updated successfully!');
      console.log('Update response:', result);
    } catch (error) {
      alert('Error updating profile: ' + error);
      console.error('Update error:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (!currentUser?.email) {
      alert('Unable to update password without an email address.');
      return;
    }

    try {
      const result = await dispatch(update_password({
        email: currentUser.email,
        newPassword: passwordData.newPassword,
      })).unwrap();

      alert(result?.message || 'Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error?.message || 'Error updating password');
      console.error('Password update error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;


    // otherwise fetch user details
    dispatch(get_mydetails())
      .unwrap()
      .then((res) => {
        if (!mounted) return;
        const user = res.data || res.user || res;
        console.log(user,"user in deyails response");
        if (user) {
          setFormData((prev) => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            companyLegalName: user.companyLegalName || prev.companyLegalName,
            phone: user.businessPhone || prev.phone,
            address: user.companyAddress || prev.address,
            city: user.city || prev.city,
            state: user.state || prev.state,
            zipCode: user.zipCode || prev.zipCode,
            country: user.country || prev.country,
            _id: user.id || user._id
          }));
          // persist to localStorage for consistency
          try {
            localStorage.setItem('user', JSON.stringify(user));
          } catch (err) {
            // ignore storage errors
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load user details', err);
      });


    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Header />

      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>


        <Container maxWidth="md" sx={{ py: 6 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 3 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" gutterBottom>
            Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Manage your account information
          </Typography>

          

          {/* Account Information */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyLegalName"
                    value={formData.companyLegalName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {/* Change Password */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
