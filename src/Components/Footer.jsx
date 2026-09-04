import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HeaderBackground, HEADINGTXT, PRIMARY } from '../Constants/Colors';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      background: `linear-gradient(135deg, ${HeaderBackground} 0%, ${PRIMARY} 100%)`,
      color: 'white',
      py: 8,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.1)',
        pointerEvents: 'none'
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                🚛 Cheap Load
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
              >
                Connecting shippers, carriers, and transporters in one seamless platform. Your trusted logistics partner.
              </Typography>
            </Box>

            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  backgroundColor: '#fff',
                  borderRadius: 2
                }
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { text: 'Home', path: '/' },
                { text: 'Contact & Support', path: '/contact-support' },
                { text: 'Disclaimer', path: '/disclaimer' },
                { text: 'Registration Info', path: '/registration-info' }
              ].map((link, index) => (
                <Link
                  key={index}
                  component="button"
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: 'white',
                    opacity: 0.8,
                    textAlign: 'left',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 400,
                    transition: 'all 0.3s ease',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    '&:hover': {
                      opacity: 1,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateX(5px)',
                      textDecoration: 'none'
                    }
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  backgroundColor: '#fff',
                  borderRadius: 2
                }
              }}
            >
              Legal & Safety
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                lineHeight: 1.7,
                fontSize: '1rem'
              }}
            >
              This platform is a neutral marketplace. We prioritize safety and transparency. Not responsible for damages, disputes, or unauthorized transport activity.
            </Typography>

            <Box sx={{
              mt: 3,
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                🛡️ Safety First
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                All transactions are verified and monitored for your protection.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{
          borderTop: '2px solid rgba(255,255,255,0.2)',
          mt: 6,
          pt: 4,
          textAlign: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: 2,
          p: 3
        }}>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            © {new Date().getFullYear()} Cheap Load. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.6,
              mt: 1,
              fontSize: '0.9rem'
            }}
          >
            Built with ❤️ for seamless logistics
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
