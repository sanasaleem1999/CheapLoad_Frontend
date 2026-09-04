import React from 'react';
import { Container, Box, Typography, Divider } from '@mui/material';
import { SECONDARY } from '../../Constants/Colors';
import Shipper1 from "../Assets/shippers.jpg";
import Shipper2 from '../Assets/shipper2.jpg';


const steps = [
  { number: 1, heading:"Post Shipment",content: "Go to Create Listing, add your shipment details, and post it.You can see your post in the Listing section" },
  { number: 2, heading:"Driver Contacts You",content:"Drivers on the platform can see your post and will call you directly.Talk to them, share pictures, and agree on the price." },
  { number: 3, heading:"Assign Driver", content:" The driver gives you their company name — just assign them to your post.It will move to the Assigned section"},
];

const HowItWorks = () => {
  const secondSteps = [
    { number: 3, heading: "Pickup", content: "When the driver picks up your vehicle, they mark it as Picked Up.\nYou can see it in the Picked Up section." },
    { number: 4, heading: "Delivery", content: "After delivery, the driver marks it as Delivered.You can view it in the Delivered section." },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight={700} mb={4} fontSize={"38px"}>
        How It Works
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={6}>
        {/* Left: Steps */}
        <Box flex={1.2} display="flex" flexDirection="column" justifyContent="center" alignItems="center" px={2}>
          <Typography variant="h5" fontWeight={600} align="left" mb={3} sx={{ width: '100%' }}>
            Steps to Get Started
          </Typography>
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <Box width="100%" py={3}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: SECONDARY,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: 24,
                      mr: 2,
                    }}
                  >
                    {step.number}
                  </Box>
                  <Typography variant="h6" color={SECONDARY} fontWeight={600} fontSize={"28px"}>
                    {step.heading}
                  </Typography>
                </Box>
                <Typography variant="body1" fontSize={"22px"} color="text.secondary" pl={7}>
                  {step.content}
                </Typography>
              </Box>
              {idx < steps.length - 1 && <Divider sx={{ width: '90%', mx: 'auto', my: 1 }} />}
            </React.Fragment>
          ))}
        </Box>
        {/* Right: Image with triangle */}
        <Box flex={1} display="flex" justifyContent="center" alignItems="center" position="relative">
          <Box position="relative" width={400} height={400}>
            {/* Triangle shape */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderLeft: '90px solid #B79F04',
                borderBottom: '90px solid transparent',
                zIndex: 2,
              }}
            />
            {/* Main image */}
            <img
              src={Shipper1}
              alt="How it works"
              style={{ width: '100%', height: '100%', borderRadius: 24, objectFit: 'cover', position: 'relative', zIndex: 1 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Second Section: Image left, content right */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={6} mt={8}>
        {/* Left: Image with triangle */}
        <Box flex={1} display="flex" justifyContent="center" alignItems="center" position="relative">
          <Box position="relative" width={400} height={400}>
            {/* Triangle shape */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderLeft: '90px solid #B79F04',
                borderBottom: '90px solid transparent',
                zIndex: 2,
              }}
            />
            {/* Main image */}
            <img
              src={Shipper2}
              alt="Track shipment"
              style={{ width: '100%', height: '100%', borderRadius: 24, objectFit: 'cover', position: 'relative', zIndex: 1 }}
            />
          </Box>
        </Box>
        {/* Right: Steps */}
        <Box flex={1.2} display="flex" flexDirection="column" justifyContent="center" alignItems="center" px={2}>
         
          {secondSteps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <Box width="100%" py={3}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: SECONDARY,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: 24,
                      mr: 2,
                    }}
                  >
                    {step.number}
                  </Box>
                  <Typography variant="h6" color={SECONDARY} fontWeight={600} fontSize={"28px"}>
                    {step.heading}
                  </Typography>
                </Box>
                <Typography variant="body1" fontSize={"22px"} color="text.secondary" pl={7}>
                  {step.content}
                </Typography>
              </Box>
              {idx < secondSteps.length - 1 && <Divider sx={{ width: '90%', mx: 'auto', my: 1 }} />}
            </React.Fragment>
          ))}
          <Box width="100%" display="flex" justifyContent="center" mt={4}>
            <button style={{
              background: SECONDARY,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '16px 40px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(32,44,88,0.15)'
            }}>
              Get Started
            </button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default HowItWorks;
