"use client";
import React from "react";
import NavigationBar from "../components/NavigationBar";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SettingPage() {

  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [password, setPassword] = useState("");

  const handleUpdate = async () => {
  const res = await fetch("/api/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",  // ⬅️ critical for session cookies
    body: JSON.stringify({
      name: name,
      email: email,
      password: password, // optional
    }),
  });

  const data = await res.json();
  if (res.ok) {
    console.log("✅ Updated:", data);
  } else {
    console.error("❌ Update failed:", data.message);
  }
};



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
          bgcolor="white"
      >
      
        <Typography 
          variant="h5" 
          sx={{color:"black" ,textAlign:"center"}}>Update Profile</Typography>

        <TextField 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          label="Name" 
          type="name"
          fullWidth
          margin="normal"/>

        <TextField 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          label="Email" 
          type="email"
          fullWidth
          margin="normal" />

        <TextField 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          label="New Password" 
          type="password" 
          fullWidth
          margin="normal" />

        <Button 
          onClick={handleUpdate}
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}>Update</Button>

      </Box>
    </>
  );
}