import { useState, useEffect } from "react";
import { TextField, Box, Typography, Card, CardMedia, CardContent, Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import "../App.css";
import API from "../api/api";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API}/movies`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", p: 3 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <TextField
          variant="outlined"
          label="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "90%", sm: "70%", md: "60%" },
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "gray" },
              "&:hover fieldset": { borderColor: "#333" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
        />
      </Box>

      {/* Movie List */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <Card key={movie.id} onClick={() => setSelectedMovie(movie)} sx={{ cursor: "pointer", bgcolor: "#fff", transition: "0.3s", "&:hover": { bgcolor: "#f0f0f0" } }}>
              <CardMedia component="img" height="300" image={movie.poster} alt={movie.title} />
              <CardContent>
                <Typography variant="h6">{movie.title}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No movies found.</Typography>
        )}
      </Box>

      {/* Movie Details Dialog */}
      <Dialog open={!!selectedMovie} onClose={() => setSelectedMovie(null)} maxWidth="sm" fullWidth>
        {selectedMovie && (
          <>
            <DialogTitle>{selectedMovie.title}</DialogTitle>
            <DialogContent>
            <CardMedia
            component="img"
            height="400"
            image={selectedMovie.poster}
            alt={selectedMovie.title}
            sx={{ objectFit: "contain", width: "100%" }}/>
              <Typography variant="body1" sx={{ mt: 2 }}><strong>Description:</strong> {selectedMovie.description}</Typography>
              <Typography variant="body1"><strong>Rating:</strong> {selectedMovie.rating}</Typography>
              <Typography variant="body1"><strong>Reviews:</strong> {selectedMovie.reviews}</Typography>
              <Typography variant="body1"><strong>Year:</strong> {selectedMovie.year}</Typography>
              <Typography variant="body1"><strong>Genre:</strong> {selectedMovie.genre}</Typography>
              <Button onClick={() => setSelectedMovie(null)} sx={{ mt: 2 }} color="error" variant="contained">Close</Button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Movies;