import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack
} from "@mui/material";
import API from "../api/api";

const Users = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        favorites: [],
        reviews: [],
        comments: [],
        firstName: "",
        lastName: ""
    });
    const [users, setUsers] = useState([]);

    const fetchProfile = async (token) => {
        try {
            const response = await fetch(`${API}/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`},
                });
                const result = await response.json();
                return result;
        } catch (error) {
            console.error(error);
        }
    };

    const getProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
    
        const APIResponse = await fetchProfile(token);
        if (APIResponse) {
            setProfile(APIResponse);
        }
    };
    
    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}/users`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
    
        if (profile.isAdmin) {
            fetchUsers();
        }
    }, [profile.isAdmin]);

     // function that handles boolean toggle for Admin users
     const handleAdminToggle = async (userId, currentStatus) => {
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch(`${API}/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isAdmin: !currentStatus})
            });

            if (response.ok) {
                const updatedUsers = users.map((u) => 
                u.id === userId ? { ...u, isAdmin: !currentStatus } : u 
            );
            setUsers(updatedUsers);
            }
        } catch (error) {
            console.error("Failed to toggle admin:", error);
        }
    }

    return ( 
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2, bgcolor: "#2B2D42" }}>
      {!profile.isAdmin ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            YOU MUST BE AN ADMIN TO VIEW THIS PAGE
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" mb={3}>
            Admin Panel
          </Typography>

          <List>
            {users && users.map((user) => (
              <Box key={user.id}>
                <ListItem
                  secondaryAction={
                    <Button
                      variant="outlined"
                      color={user.isAdmin ? "error" : "primary"}
                      onClick={() => handleAdminToggle(user.id, user.isAdmin)}
                    >
                      {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName} (${user.email})`}
                    secondary={`Reviews: ${user.reviews?.length || 0} | Admin: ${user.isAdmin ? "Yes" : "No"}`}
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </Paper>
      )}
    </Box>
    );
}
 
export default Users;