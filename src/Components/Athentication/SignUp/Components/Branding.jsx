import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import Logistics from '../../.././Assets/Logistics.gif' // Adjust path as needed

const Branding = () => {
  return (
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
                height: '50%', // corrected from '5d0%'
                objectFit: 'fit', // probably 'contain' or 'cover', but keeping as is
                borderRadius: 3,
              }}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Branding;