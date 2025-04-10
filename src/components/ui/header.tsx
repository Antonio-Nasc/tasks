"use client";

import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

export const Header = () => {

  const handleLogout = async () => {
    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || "http://localhost:8080/realms/reino-controle";
    const redirectUri = encodeURIComponent("http://localhost:3000"); 

    // Redireciona para o logout do Keycloak
    window.location.href = `${issuer}/protocol/openid-connect/logout?redirect_uri=${redirectUri}`;
  };
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CheckCircleIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div">
            TaskMaster
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
