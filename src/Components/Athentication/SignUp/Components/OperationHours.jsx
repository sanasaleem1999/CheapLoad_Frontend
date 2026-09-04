import React from 'react';
import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const OperationHours = ({ formData,handleChange,formErrors }) => {
  return (
    <Grid container sx={{ flex: 1 }}>
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
              error={!!formErrors.operationHoursStart}
              helperText={formErrors.operationHoursStart}
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
              error={!!formErrors.operationHoursEnd}
              helperText={formErrors.operationHoursEnd}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
