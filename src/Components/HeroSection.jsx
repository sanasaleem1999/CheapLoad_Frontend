import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh", // full screen
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
     {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl text-gray-900 mb-6">
              Connecting Shippers, Carriers & Transporters
            </h1>
            <h2>
              Welcome to Our Platform
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
             We connect shippers, carriers, and transporters in one easy place. Find trusted drivers, check their ratings, and book directly — all in a few clicks.
            </p>
            <div className="flex gap-4 justify-center">
             
             
            </div>
          </div>
        </div>
      </section>
    </Box>
  );
}
