"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import * as React from 'react';
import Box from "@mui/material/Box";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactsIcon from '@mui/icons-material/Contacts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';

const NavigationBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState<string>("");

  if (!pathname) return null;

  useEffect (() =>{
    if (pathname.startsWith("/home")) setValue("home");
    else if (pathname.startsWith("/connections")) setValue("connections");
    else if (pathname.startsWith("/favorites")) setValue("favorites");
    else if (pathname.startsWith("/chats")) setValue("chats");
    else if (pathname.startsWith("/settings")) setValue("settings");
    else setValue(""); 
  },  [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log("Navigating to:", newValue); 
    setValue(newValue);
    router.push(`/${newValue}`);
  };

  return (
    <Box display="flex" justifyContent="center">
    <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>

      <BottomNavigationAction
        label="Home"
        value="home"
        icon={<HomeIcon />}
      />

      <BottomNavigationAction
        label="Connections"
        value="connections"
        icon={<ContactsIcon />}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Chats"
        value="chats"
        icon={<ChatIcon />}
      />
      <BottomNavigationAction 
        label="Settings" 
        value="settings" 
        icon={<SettingsIcon/>} />
    </BottomNavigation>
    </Box>
  );
}

export default NavigationBar;