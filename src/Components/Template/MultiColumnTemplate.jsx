import React from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { SECONDARY, background, PRIMARY } from "../../Constants/Colors";

const MultiColumnTemplate = ({ imageSrc, heading, subheading, rightComponent, extraInfo, extraLink }) => {
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', backgroundColor: background, py: 0, display: 'flex', alignItems: 'stretch' }}>
      <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', minHeight: '100vh' }}>
          {/* Left Column: Center Image, Content, Extra Info, Extra Link */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', px: 4 }}>
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Section visual"
                style={{ width: '320px', height: '320px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 4px 24px rgba(32,44,88,0.10)' }}
              />
            )}
            <Typography variant="h4" fontWeight={700} color={PRIMARY} align="center" mt={3} sx={{ fontFamily: 'serif' }}>
              {heading}
            </Typography>
            <Typography variant="subtitle1" color={SECONDARY} align="center" mt={1} sx={{ fontFamily: 'serif' }}>
              {subheading}
            </Typography>
            {extraInfo && (
              <Box mt={3} width="100%" sx={{ background: background, borderRadius: 2, p: 2, boxShadow: '0 2px 8px rgba(32,44,88,0.06)' }}>
                {extraInfo}
              </Box>
            )}
            {extraLink && (
              <Box mt={2}>
                <a href={extraLink.url} target="_blank" rel="noopener noreferrer" style={{ color: PRIMARY, fontWeight: 'bold', fontFamily: 'serif', textDecoration: 'underline', fontSize: 16 }}>
                  {extraLink.label || extraLink.url}
                </a>
              </Box>
            )}
          </Box>
          {/* Right Column: Custom Component */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', px: 4, overflowY: 'auto', minHeight: 0 }}>
            {rightComponent}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MultiColumnTemplate;
