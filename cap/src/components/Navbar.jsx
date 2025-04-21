import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem("adminLoggedIn");
    setIsLoggedIn(adminStatus === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 10 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flex: 1}}>
            Scene It All
          </Typography>

          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          <Button color="inherit" component={Link} to="/Movies">
            Movies
          </Button>

          <Button color="inherit" component={Link} to="/">
            Top Rated
          </Button>

        <Box sx={{ ml: 2 }}>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <IconButton color="inherit">
              {/* You can add an icon here if needed */}
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
    </>
  );
}
