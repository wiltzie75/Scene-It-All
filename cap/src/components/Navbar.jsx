import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({token, setToken}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setIsAdmin(user.isAdmin);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 10 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flex: 1 }}>
            Scene It All
          </Typography>

          {/* Navigation buttons */}
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/movies">
            Movies
          </Button>
          <Button color="inherit" component={Link} to="/">
            Top Rated
          </Button>

          <Box sx={{ ml: 2 }}>
            {token ? (
              <>
                <Button color="inherit" component={Link} to="/watchlist">
                Watchlist
                </Button>
                <Button color="inherit" component={Link} to="/myreviews">
                My Reviews
                </Button>
                <Button color="inherit" component={Link} to="/mycomments">
                My Comments
                </Button>
                {isAdmin ? (
                  <>
                      <Button color="inherit" component={Link} to="/users">
                      Manage Users
                      </Button>
                      <Button color="inherit" component={Link} to="/admin">
                      Manage Movies
                      </Button>
                  </>
                ) : null}
                <Button color="inherit" onClick={handleLogout}>
                Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
