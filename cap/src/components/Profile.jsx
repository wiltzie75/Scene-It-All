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
  const [userRatings, setUserRatings] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [isEditingRating, setIsEditingRating] = useState(false);

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

  const fetchUserRatings = async (userId, token) => {
    try {
      const response = await fetch(`${API}/ratings/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
  
      const ratingsMap = data.reduce((acc, rating) => {
        acc[rating.movieId] = rating.score;
        return acc;
      }, {});
  
      setUserRatings(ratingsMap);
  
      const submittedMap = {};
      data.forEach((rating) => {
        submittedMap[rating.movieId] = true;
      });
      setSubmitted(submittedMap);
  
      return ratingsMap;
    } catch (error) {
      console.error("Error fetching user ratings:", error);
      return {};
    }
  };

  const handleRating = (movieId, score) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user?.id) {
      alert("User info not found.");
      return;
    }
  
    fetch(`${API}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        userId: user.id,
        movieId,
        score,
        review: ""
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Rating failed");
        return res.json();
      })
      .then(() => {
        setUserRatings((prev) => ({ ...prev, [movieId]: score }));
        setSubmitted((prev) => ({ ...prev, [movieId]: true }));
      })
      .catch((err) => {
        console.error("Error submitting rating:", err);
        alert("Something went wrong when submitting your rating.");
      });
  };

  const enableRatingEdit = () => {
    setIsEditingRating(true);
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
                    <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginBottom: "0.3rem" }}><strong>Your Rating:</strong></Typography>
                {[1, 2, 3, 4, 5].map((value) => (
                  <IconButton
                  key={value}
                  onClick={() => handleRating(selectedMovie.id, value)}
                  disabled={ratingSubmitted[selectedMovie.id] && !isEditingRating}
                  sx={{
                    fontSize: "1.5 rem",
                    p: 0.2,
                    mb: 0.25, 
                    minWidth: 0,
                    color: value <= (selectedMovie.userRating || 0) ? "gold !important" : "gray",
                    cursor: (ratingSubmitted[selectedMovie.id] && !isEditingRating) ? "default" : "pointer",
                  }}
                >
                  <StarIcon fontSize="small" />
                </IconButton>
                ))}
                {ratingSubmitted[selectedMovie.id] && !isEditingRating && (
                  <Button 
                    onClick={enableRatingEdit} 
                    size="small" 
                    variant="outlined" 
                    sx={{ fontSize: "0.7rem", p: "2px 8px", ml: 1, height: "24px" }}
                  >
                    Edit Rating
                  </Button>
                )}
              </Box>
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