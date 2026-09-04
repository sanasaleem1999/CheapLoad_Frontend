import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PRIMARY, BACKGROUND, SECONDARY,HEADINGTXT } from "../../Constants/Colors"

export const MainHeader = () => {
    const navigate = useNavigate();

    return (
        <>
            <Box
                sx={{
                    background: ` linear-gradient(135deg, #FFFF 50%)`,
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            gap: 4,
                        }}
                    >
                        <Box sx={{ color: HEADINGTXT }}>
                            <Typography variant="h3" fontWeight={700} mb={2} fontSize={"25px"} color={SECONDARY}>
                                Connecting Shippers, Carriers & Transporters
                            </Typography>
                            <Typography variant="h2" fontWeight={700} mb={2} fontSize={"40px"}>
                                Welcome to Our Platform
                            </Typography>
                            <Typography variant="body1" mb={3} fontSize={"22px"}>
                                We connect shippers, carriers, and transporters in one easy place.
                                Find trusted drivers, check their ratings, and book directly — all in a few clicks.
                            </Typography>
                            <Box sx={{ backgroundColor: PRIMARY, borderRadius: "10px", padding: "15px", mb: 3, width: { xs: "90%", md: "70%" }, margin: "0 auto" }}>
                                <Typography variant="body1" >
                                    We are only a platform. We are not responsible for any disputes, damages, or payments between users.
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ mt: 3 }}
                                onClick={() => navigate('/register')}
                            >
                                Register Now
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    )
}