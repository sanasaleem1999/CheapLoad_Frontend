import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StarRateIcon from "@mui/icons-material/StarRate";

const cardData = [
  {
    title: "Partner with Confidence",
    description:
      "Central Dispatch works with thousands of shippers and carriers, and has thousands of loads posted every day.",
    icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#b79f04" }} />
  },
  {
    title: "Manage Your Shipments",
    description:
      "Get your shipments moving fast with digital dispatches, and see all of your listed vehicles, current jobs, and automatically updated records on a single dashboard at any time.",
    icon: <DashboardIcon sx={{ fontSize: 40, color: "#b79f04" }} />
  },
  {
    title: "Rate Your Jobs",
    description:
      "Our rating system lets you rate every partner for each verified transaction in multiple categories. Leave a written review for more detailed feedback, and help everyone make better partnering decisions.",
    icon: <StarRateIcon sx={{ fontSize: 40, color: "#b79f04" }} />
  }
];

export const InfoCards = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      {/* Heading */}
      <Typography
        variant="h1"
        sx={{
          color: "#202c58",
          fontWeight: "bold",
          mb: 4,
          fontSize: { xs: "1.8rem", md: "2.2rem" }
        }}
      >
        Moving vehicles is better when you have the power to…
      </Typography>

      {/* Cards in one row always */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3
        }}
      >
        {cardData.map((card, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "#202c58",
              color: "white",
              borderRadius: "16px",
              width: "30%", // 👈 forces 3 per row
              boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "translateY(-8px)" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              p: 2
            }}
          >
            <div style={{ marginBottom: "1rem" }}>{card.icon}</div>
            <CardContent>
              <Typography
                variant="h5"
                sx={{ color: "#b79f04", fontWeight: "bold", mb: 1 }}
              >
                {card.title}
              </Typography>
              <Typography variant="p">{card.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};



export const StatCards = () => {

  const statData = [
    {
      title: "Monthly Price Per Mile",
      description:
        "Down 8¢ YoY (Aug 2024)",
      MainTitle: "7.8%",
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#b79f04" }} />
    },
    {
      title: "Average Mileage On Listings",
      description:
        "Up 202 Miles YoY (Aug 2024)",
      MainTitle: "20.1%",
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#b79f04" }} />
    },
  ]
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      {/* Heading */}
      <Typography
        variant="h1"
        sx={{
          color: "#202c58",
          fontWeight: "bold",
          mb: 4,
          fontSize: { xs: "1.8rem", md: "2.2rem" }
        }}
      >
        Market Intelligence
      </Typography>
      <Typography
        variant="h3"
        sx={{
          color: "#b79f04",
          fontWeight: "bold",
          mb: 4,
          fontSize: { xs: "1.8rem", md: "2.2rem" }
        }}
      >
        Data to help you make more informed transportation decisions.
      </Typography>

      {/* Cards in one row always */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3
        }}
      >
        {statData.map((card, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "#202c58",
              color: "white",
              borderRadius: "16px",
              width: "30%", // 👈 forces 3 per row
              boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "translateY(-8px)" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              p: 2
            }}
          >
             <Typography
                variant="h2"
                sx={{ color: "#b79f04", fontWeight: "bold", mb: 1 }}
              >
                {card.MainTitle}
              </Typography>
            <div style={{ marginBottom: "1rem" }}>{card.icon}</div>
            <CardContent>
              <Typography
                variant="h5"
                sx={{ color: "#b79f04", fontWeight: "bold", mb: 1 }}
              >
                {card.title}
              </Typography>
              <Typography variant="p">{card.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

