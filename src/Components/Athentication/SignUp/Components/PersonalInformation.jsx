import React from 'react';
import { Grid, Box, Typography, InputLabel, FormControl, TextField, Select, Paper, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export const PersonalInformation = ({ formData, handleChange, formErrors }) => {
  return (
    <Grid container sx={{ flex: 1 }}>
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
              error={!!formErrors.businessPhone}
              helperText={formErrors.businessPhone}
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
              error={!!formErrors.email}
              helperText={formErrors.email}
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
              error={!!formErrors.confirmEmail}
              helperText={formErrors.confirmEmail}
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
              error={!!formErrors.password}
              helperText={formErrors.password}
              required
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="business-type-label">Business Type</InputLabel>
              <Select
                labelId="business-type-label"
                id="business-type"
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
    </Grid>
  )
}