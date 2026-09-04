import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export const Stats = () => {
    return (
        <Box
            sx={{
                backgroundImage: `linear-gradient(
        rgba(32, 44, 88, 0.8),  
        
        rgba(32, 44, 88, 0.8)   
        ),url('https://i.pinimg.com/736x/0a/f2/54/0af254e4b552b147856edc6bb7e17aa7.jpg')`, // 🔁 replace with your image
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                textAlign: "center",
                py: 8, // vertical padding
                px: 4, // horizontal padding
                minHeight: "300px"
            }}
        >
            {/* Main Heading */}
            <Typography
                variant="h2"
                sx={{
                    fontWeight: "bold",
                    mb: 4,
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                    color: "#b79f04"
                }}
            >
                Lots of choices for shippers. Lots of vehicles for carriers.
            </Typography>

            {/* Two Columns */}
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#b79f04" }}
                    >
                        20,000+
                    </Typography>
                    <Typography variant="h4">
                        carriers in our network over the last year
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#b79f04" }}
                    >
                        10,000,000+
                    </Typography>
                    <Typography variant="h4">VEHICLES POSTED EACH YEAR</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

