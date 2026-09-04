import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { register_user, removeMessage } from "../../Store/authenticationReducer";
import DisclaimerModal from "../Home/DisclaimerModal";
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Logistics from "../../Components/Assets/Logistics.gif";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, status, message } = useSelector(
    (state) => state.authentication
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    businessType: "Shipper",
    companyLegalName: "",
    country: "",
    state: "",
    city: "",
    companyAddress: "",
    zipCode: "",
    operationHoursStart: "",
    operationHoursEnd: "",
    businessPhone: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [zipError, setZipError] = useState("");
  // used to open the disclaimer when user hits submit
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validatePhone = (phone) => {
    // Accepts 10-15 digits, optional +, spaces, dashes, parentheses
    return /^\+?[0-9\s\-()]{10,15}$/.test(phone);
  };
  const validateZip = (zip) => {
    // Accepts US ZIP (12345 or 12345-6789) or Canadian (A1A 1A1)
    return /^\d{5}(-\d{4})?$|^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(zip);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email" || name === "confirmEmail") {
      if (!validateEmail(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    }
    if (name === "businessPhone") {
      if (!validatePhone(value)) {
        setPhoneError("Please enter a valid phone number.");
      } else {
        setPhoneError("");
      }
    }
    if (name === "zipCode") {
      if (!validateZip(value)) {
        setZipError("Please enter a valid postal/zip code.");
      } else {
        setZipError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    // Email match
    if (formData.email !== formData.confirmEmail) {
      setEmailError('Emails do not match!');
      valid = false;
    }
    // Email format
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    // Phone format
    if (!validatePhone(formData.businessPhone)) {
      setPhoneError('Please enter a valid phone number.');
      valid = false;
    }
    // Zip format
    if (!validateZip(formData.zipCode)) {
      setZipError('Please enter a valid postal/zip code.');
      valid = false;
    }
    if (!valid) return;
    setEmailError("");
    setPhoneError("");
    setZipError("");
    // instead of submitting immediately, open the disclaimer modal
    setPendingFormData(formData);
    setShowDisclaimer(true);
  };

  useEffect(() => {
    console.log(status, message, "status after");
    if (
      status === "fulfilled" &&
      message?.toLowerCase().includes("user created successfully")
    ) {
      console.log("Opening modal...");
      setOpenModal(true);
      dispatch(removeMessage());
    }
  }, [status, message, dispatch]);

  const handleClose = () => {
    setOpenModal(false);
    navigate("/login");
  };

  const handleDisclaimerAgree = () => {
    // user agreed — submit stored form data
    if (pendingFormData) {
      dispatch(register_user(pendingFormData));
      setPendingFormData(null);
    }
    setShowDisclaimer(false);
  };

  const handleDisclaimerClose = () => {
    // user closed without agreeing — just close the disclaimer
    setShowDisclaimer(false);
  };




  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
      <Grid container sx={{ flex: 1 }}>
        {/* Left side - Branding */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ textAlign: 'center', color: 'white', zIndex: 1, maxWidth: 500 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              Join Our Platform
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, lineHeight: 1.6 }}>
              Connect with thousands of shippers and carriers nationwide
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: 450,
                height: 450,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                mb: 3,
                mx: 'auto',
                overflow: 'hidden', // important
              }}
            >
              <Box
                component="img"
                src={Logistics}
                alt="Shipping Animation"
                sx={{
                  width: '50%',
                  height: '5d0%',
                  objectFit: 'fit', // fills the box
                  borderRadius: 3,
                }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Right side - Form */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'white',
            overflowY: 'auto',
            maxHeight: '100vh',
          }}
        >
          <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography
                variant="h2"
                gutterBottom
                color="primary"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                Registration
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                Create Your Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Fill in your details below to get started
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    Personal Information
                  </Typography>
                </Box>
                <Grid container spacing={2}>
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
                      label="Business Phone"
                      name="businessPhone"
                      type="tel"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      required
                      error={!!phoneError}
                      helperText={phoneError}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={!!emailError}
                      helperText={emailError}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Email"
                      name="confirmEmail"
                      type="email"
                      value={formData.confirmEmail}
                      onChange={handleChange}
                      required
                      error={!!emailError || (formData.confirmEmail !== '' && formData.email !== formData.confirmEmail)}
                      helperText={emailError}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Business Type</InputLabel>
                      <Select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        label="Business Type"
                      >
                        <MenuItem value="Shipper">Shipper</MenuItem>
                        <MenuItem value="Carrier">Carrier</MenuItem>
                        <MenuItem value="Transporter">Transporter</MenuItem>
                        <MenuItem value="Both">Both Shipper & Carrier</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>

              {/* Company Information */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BusinessIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    Company Information
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Legal Name"
                      name="companyLegalName"
                      value={formData.companyLegalName}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Address"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      error={!!zipError}
                      helperText={zipError}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Operation Hours */}
              <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    Operation Hours
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Opening Time"
                      name="operationHoursStart"
                      type="time"
                      value={formData.operationHoursStart}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Closing Time"
                      name="operationHoursEnd"
                      type="time"
                      value={formData.operationHoursEnd}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Submit Button */}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ py: 1.5, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
              </Button>

              <Typography variant="body2" align="center" color="text.secondary">
                Already have an account?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none', p: 0 }}
                >
                  Login here
                </Button>
              </Typography>
            </form>
          </Container>
        </Grid>
      </Grid>

      {/* ✅ Success Modal */}
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>You are successfully registered!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      {/* Disclaimer modal used on-demand when user submits */}
      <DisclaimerModal controlledOpen={showDisclaimer} onAgree={handleDisclaimerAgree} onClose={handleDisclaimerClose} />
    </Box>
  );
}