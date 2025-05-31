"use client";
import React from "react";
import NavigationBar from "../components/NavigationBar";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {

  return (
    <>
      <NavigationBar/>
      <Box
        width={350}
          mx="auto"
          mt={8}
          p={4}
          borderRadius={2}
          boxShadow={3}
          bgcolor="white">
        <Typography variant="h5" 
          sx={{color:"black" ,textAlign:"center"}}>Welcome To M-App!</Typography>

      </Box>
    </>
  );
}