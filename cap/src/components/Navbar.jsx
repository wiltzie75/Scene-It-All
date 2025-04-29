import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Typography, Box, IconButton, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ token, setToken }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setIsAdmin(user.isAdmin);
      setProfilePic(user.profilePic || "default-profile.jpg"); 
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        zIndex: 10,
        backgroundColor: "#D90429",
        transition: "background-color 0.3s ease", 
        "&:hover": { backgroundColor: "#A6031A" }, 
      }}
    >
      <Toolbar>
        <Typography 
          variant="h5" 
          sx={{
            flex: 1,
            fontFamily: "Montserrat, sans-serif", 
            cursor: "pointer",
            "&:hover": { color: "#FFF176" },
          }}
          onClick={() => navigate("/")} 
        >
          Scene It All
        </Typography>

        {/* Navigation buttons */}
        <Button
          sx={{
            color: "white",
            margin: "0 8px",
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": {
              color: "#FFF176",
              transform: "scale(1.1)",
              transition: "all 0.3s ease",
            },
          }}
          component={Link} 
          to="/"
        >
          Home
        </Button>
        <Button
          sx={{
            color: "white",
            margin: "0 8px",
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": {
              color: "#FFF176",
              transform: "scale(1.1)",
              transition: "all 0.3s ease",
            },
          }}
          component={Link} 
          to="/movies"
        >
          Movies
        </Button>
        <Button
          sx={{
            color: "white",
            margin: "0 8px",
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": {
              color: "#FFF176",
              transform: "scale(1.1)",
              transition: "all 0.3s ease",
            },
          }}
          component={Link} 
          to="/topRated"
        >
          Top Rated
        </Button>

        <Box sx={{ ml: 2 }}>
          {token ? (
            <>
              <Button
                sx={{
                  color: "white",
                  margin: "0 8px",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    color: "#FFF176",
                    transform: "scale(1.1)",
                    transition: "all 0.3s ease",
                  },
                }}
                component={Link} 
                to="/myreviews"
              >
                My Reviews
              </Button>
              <Button
                sx={{
                  color: "white",
                  margin: "0 8px",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    color: "#FFF176",
                    transform: "scale(1.1)",
                    transition: "all 0.3s ease",
                  },
                }}
                component={Link} 
                to="/mycomments"
              >
                My Comments
              </Button>
              {isAdmin && (
                <>
                  <Button
                    sx={{
                      color: "white",
                      margin: "0 8px",
                      fontSize: "1rem",
                      textTransform: "none",
                      "&:hover": {
                        color: "#FFF176",
                        transform: "scale(1.1)",
                        transition: "all 0.3s ease",
                      },
                    }}
                    component={Link} 
                    to="/users"
                  >
                    Manage Users
                  </Button>
                  <Button
                    sx={{
                      color: "white",
                      margin: "0 8px",
                      fontSize: "1rem",
                      textTransform: "none",
                      "&:hover": {
                        color: "#FFF176",
                        transform: "scale(1.1)",
                        transition: "all 0.3s ease",
                      },
                    }}
                    component={Link} 
                    to="/admin"
                  >
                    Manage Movies
                  </Button>
                </>
              )}
              <IconButton 
                sx={{
                  margin: "0 8px",
                  "&:hover": { 
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", 
                    transform: "scale(1.1)",
                    transition: "all 0.3s ease",
                  },
                }}
                component={Link} 
                to="/profile"
              >
                <Avatar src={profilePic} alt="Profile" />
              </IconButton>
              <Button
                sx={{
                  color: "white",
                  margin: "0 8px",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    color: "#FFF176",
                    transform: "scale(1.1)",
                    transition: "all 0.3s ease",
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={{
                  color: "white",
                  margin: "0 8px",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    color: "#FFF176",
                    transform: "scale(1.1)",
                    transition: "all 0.3s ease",
                  },
                }}
                component={Link} 
                to="/login"
              >
                Login
              </Button>
              <Button
                sx={{
                  color: "white",
                  margin: "0 8px",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    color: "#FFF176",
                    transform: "scale(1.1)",
                    transition: "all 0.3s ease",
                  },
                }}
                component={Link} 
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
