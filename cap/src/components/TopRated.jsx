import React, { useEffect, useState } from "react";
import { TextField, Box, Typography, IconButton, Card, CardMedia, CardContent, Dialog, DialogContent, DialogTitle, Button, Pagination } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import API from "../api/api";

const TopRated = () => {
  const [movies, setMovies] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchMovies();
  }, []);

  const getMovies = async () => {
    const res = await fetch(`${API}/movies`);
    const data = await res.json();
    return data.sort((a, b) => b.rating - a.rating).slice(0, 10);
  };
  
  const fetchMovies = async () => {
    try {
      const movies = await getMovies();
      setMovies(movies);
      setLoading(false);
      return movies;
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to load top rated movies.");
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      // First fetch the movies
      const fetchedMovies = await fetchMovies();
      
      // Then fetch user ratings if logged in
      if (token && user?.id) {
        const ratings = await fetchUserRatings(user.id, token);
        
        // Combine movies with ratings
        const moviesWithRatings = fetchedMovies.map(movie => ({
          ...movie,
          userRating: ratings[movie.id] || 0
        }));
        
        // Update movies with ratings applied
        setMovies(moviesWithRatings);
      }
    };
    
    fetchInitialData();
  }, []);

  const fetchUserRatings = async (userId, token) => {
    try {
      const response = await fetch(`${API}/ratings/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      const ratingsMap = data.reduce((acc, rating) => {
        acc[rating.movieId] = rating.score;
        return acc;
      }, {});
      
      setUserRatings(ratingsMap);
      
      // Also mark these as submitted
      const submittedMap = {};
      data.forEach(rating => {
        submittedMap[rating.movieId] = true;
      });
      setSubmitted(submittedMap);
      
      return ratingsMap;
    } catch (error) {
      console.error("Error fetching user ratings:", error);
      return {};
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

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
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === movieId
              ? { ...movie, userRating: score } // Update the rating of the movie
              : movie
          )
        );
        setSubmitted((prev) => ({ ...prev, [movieId]: true }));
        setSelectedMovie((prevMovie) => ({
          ...prevMovie,
          userRating: score,
        }));
      })
      .catch((err) => {
        console.error("Error submitting rating:", err);
        alert("Something went wrong when submitting your rating.");
      });
  };

  if (loading) return <p>Loading top rated movies...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Top 10 Highest Rated Movies
      </Typography>
      <Box
        sx={{
          color: "black",
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        {movies.map((movie) => (
          <Box
            key={movie.id}
            sx={{
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#8D99AE",
              boxSizing: "border-box",
            }}
          >
            {movie.imageUrl && (
              <img
                src={movie.imageUrl}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />
            )}
            <Typography variant="h6"><strong>{movie.title}</strong></Typography>
            <Card key={movie.id} sx={{ cursor: "pointer", maxHeight: 220, maxWidth: 160 }}>
            <CardMedia
              component="img"
              image={movie.poster}
              alt={movie.title}
              sx={{ height: "auto", width: "100%" }}
            />
            </Card>
            <br></br>
            <Typography>
              <strong>Average Rating: </strong>{movie.imdbRating}
            </Typography>
            {isLoggedIn &&
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Your Rating:</strong>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <IconButton
                      key={value}
                      onClick={() => handleRating(movie.id, value)}
                      disabled={submitted[movie.id]}
                      sx={{
                        fontSize: "1.5rem",
                        p: 0.2,
                        mb: 0.25,
                        minWidth: 0,
                        color: value <= (userRatings[movie.id] || 0) ? "gold !important" : "gray",
                        cursor: submitted[movie.id] ? "default" : "pointer",
                      }}
                    >
                      <StarIcon fontSize="small" />
                    </IconButton>
                  ))}
                  {/* {submitted[movie.id] && (
                    <Button
                      onClick={() => setSubmitted((prev) => ({ ...prev, [movie.id]: false }))}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "0.7rem",
                        p: "2px 8px",
                        ml: 1,
                        height: "24px",
                      }}
                    >
                      Edit Rating
                    </Button> */}
                  {/* )} */}
                </Box>
                {/* {submitted[movie.id] && <Typography variant="body2">Thanks for rating!</Typography>} */}
              </Box>
            }
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TopRated;
