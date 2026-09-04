import React from 'react';
import { H1, PRIMARY, SECONDARY, p, background, HEADINGTXT, HeaderBackground, Dashboardbackground } from '../../Constants/Colors';
import { Container, Card, CardContent, Typography, Box } from "@mui/material";
import Shipper1 from "../Assets/shippers.jpg";
import Shipper2 from '../Assets/shipper2.jpg';
const shipperSections = [
  {
    heading: 'For Shippers',
    items: [
      'Post shipments easily in minutes.',
      'View driver ratings and reviews.',
      'Print driver ID and insurance.',
      'Talk directly with drivers — no middleman.',
    ],
    color: SECONDARY,
    icon: '🚚',
    image: Shipper1,
  },
  {
    heading: 'For Carriers / Transporters',
    items: [
      'Find loads that match your route.',
      'Build your reputation with reviews.',
      'Get direct bookings and grow your business.',
    ],
    color: SECONDARY,
    icon: '🛣️',
    image: Shipper1,
  },
  {
    heading: 'Safety & Verification',
    items: [
      'Every driver shows ratings and reviews.',
      'You can print ID and insurance from their profile.',
      'If not available, ask the driver directly before pickup.',
    ],
    color: SECONDARY,
    icon: '✅',
    image: Shipper2,
  },
  {
    heading: 'No Double Brokering',
    items: [
      'Double brokering is not allowed on our platform.',
      'Changing prices or giving the job to another driver without permission is not allowed.',
      'Always confirm who will pick up, deliver, and the final price.',
    ],
    color: SECONDARY,
    icon: '🚫',
    image: Shipper2,
  },
];

const importantNotice = [
  'This platform only connects shippers and carriers.',
  'We are not responsible for damages, disputes, or payments.',
  'If any issue happens, contact the driver or company directly.',
  'Our goal: make every shipment smooth, safe, and easy for everyone.',
];

const ShipperInfo = () => (
  <Box sx={{ width: '100%', backgroundColor: PRIMARY, py: 8 }}>
    <Container maxWidth="xl">

    {/* Title */}
    <Typography
      variant="h3"
      align="center"
      fontWeight={700}
      mb={4}
      fontSize="38px"
      color={Dashboardbackground}
      sx={{ fontFamily: 'serif', letterSpacing: 1 }}
    >
      Shipper & Carrier Information
    </Typography>

    {/* Main Section */}
    {Array.from({ length: Math.ceil(shipperSections.length / 2) }, (_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', flexDirection: 'row', gap: 8, mb: rowIndex < Math.ceil(shipperSections.length / 2) - 1 ? 8 : 0, width: '100%' }}>
          {shipperSections.slice(rowIndex * 2, rowIndex * 2 + 2).map((section, index) => (
            <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 2, backgroundColor: "white", borderRadius: 4, p: 5, alignItems: 'stretch' }}>
              <Box sx={{ flex: 0.7, minHeight: '250px' }}>
                <img
                  src={section.image}
                  alt="How it works"
                  style={{ width: '100%', height: '100%', borderRadius: 24, objectFit: 'cover', position: 'relative', zIndex: 1 }}
                />
              </Box>
              <Box sx={{ flex: 1.3 }}>
                <Card
                  key={section.heading}
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 4px 24px rgba(32,44,88,0.10)',
                    background,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    minHeight: '250px',
                    p: 5,
                  }}
                >
                  <CardContent sx={{ padding: 0 }}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={section.color}
                        align="left"
                        fontSize="26px"
                        mb={2}
                        sx={{ fontFamily: 'serif' }}
                      >
                        {section.icon + " " + section.heading}
                      </Typography>
                    </Box>

                    {section.items.map((item, i) => (
                      <Typography
                        key={i}
                        variant="body1"
                        color={HEADINGTXT}
                        fontSize="20px"
                        mb={1}
                        align="left"
                        sx={{ fontFamily: 'serif' }}
                      >
                        ✅ {item}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          ))}
        </Box>
      ))}





    </Container>
  </Box>
);

export default ShipperInfo;
