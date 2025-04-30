import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import API from "../api/api";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    favorites: [],
    reviews: [],
    comments: [],
    firstName: "",
    lastName: "",
  });
  const [users, setUsers] = useState([]);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(`${API}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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

  const handleAdminToggle = async (userId, currentStatus) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: !currentStatus }),
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
  };

  const handleRemoveFromFavorite = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return alert("You need to be logged in to remove movies from your Favorites");
    }
    const userId = profile.id;

    try {
      const response = await fetch(`${API}/favorite/${userId}/${movieId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          favorites: prevProfile.favorites.filter((movie) => movie.id !== movieId),
        }));
        alert("Movie removed from Favorite!");
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error removing movie:", error);
      alert("An error occurred while removing the movie.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome {profile.firstName} {profile.lastName}
      </Typography>

      {profile.favorites.length === 0 ? (
        <Typography variant="h6" align="center">
          You have no movies in your Favorite
        </Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            My Favorites
          </Typography>
          <Grid container spacing={3}>
            {profile.favorites.map((movie) => (
              <Grid item xs={12} sm={6} md={4} key={movie.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.movie.poster}
                    alt={movie.movie.title}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Ratings: {movie.movie.imdbRating}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      onClick={() => handleRemoveFromFavorite(movie.id)}
                    >
                      Remove from Favorite
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Profile;