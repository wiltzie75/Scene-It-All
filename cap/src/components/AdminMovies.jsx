import { useState, useEffect } from 'react';
import '../App.css';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  Grid,
  Pagination,
  DialogContent,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import API from '../api/api';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedMovie, setEditedMovie] = useState({ 
    title: "", 
    plot: "",
    poster: "",
    year: "",
    genre: "", });
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: '',
    plot: '',
    poster: '',
    year: '',
    genre: '',
  });
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API}/movies`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newMovie,
          userId: currentUser?.id, // Add userId if available
        }),
      });
      if (response.ok) {
        const addedMovie = await response.json();
        setMovies((prevMovies) => [...prevMovies, addedMovie]);
        setNewMovie({
          title: '',
          plot: '',
          poster: '',
          year: '',
          genre: '',
        });
      } else {
        console.error('Failed to add movie');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleMovieEdit = (movie) => {
    setEditingMovieId(movie.id);
    setEditedMovie({ title: movie.title, plot: movie.plot, poster: movie.poster, year: movie.year, genre: movie.genre});
  };

  const handleMovieSave = async (movieId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/movies/${movieId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: editedMovie.title, 
              plot: editedMovie.plot, 
              poster: editedMovie.poster,
              year: editedMovie.year, 
              genre: editedMovie.genre
            }),
        });

        if (res.ok) { 
            const updatedMovies = movies.map((m) => 
                m.id === movieId ? { ...m, ...editedMovie } : m
            );
            setMovies(updatedMovies);
            setEditingMovieId(null);
            setEditedMovie({ 
              title: "", 
              plot: "",
              poster: "",
              year: "",
              genre: "", });
        }
    } catch (error) {
        console.error("Failed to update movie:", error);
    }
  };

  const handleMovieCancel = () => {
      setEditingMovieId(null);
      setEditedMovie({ 
        title: "", 
        plot: "",
        poster: "",
        year: "",
        genre: "", });
  };

  const handleDeleteMovie = async (id) => {
    try {
      const response = await fetch(`${API}/movies/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
      } else {
        console.error('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", gap: 2, mt: 2, p: 2, display: "flex", flexDirection: "column" }}>
      {/* Search Bar */}
      <Box sx={{ mb: 1, display: "flex", justifyContent: "center" }}>
        <TextField
          variant="outlined"
          label="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            width: "60%",
            bgcolor: "#f9f9f9",
            fontSize: "0.8rem",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "gray" },
              "&:hover fieldset": { borderColor: "#333" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              height: "36px"
            },
          }}
        />
      </Box>

        <Typography variant="h4" gutterBottom>Admin Movie Management</Typography>
        <Button variant="contained" color="primary" onClick={() => setIsMovieDialogOpen(true)}>Add New Movie</Button>

        <Dialog open={isMovieDialogOpen} onClose={() => setIsMovieDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Movie</DialogTitle>
          <DialogContent sx={{ pb: 2, bgcolor: '#8D99AE', color: '#000000' }}>
            
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              {['title', 'plot', 'poster', 'year', 'genre'].map((field) => (
                <Box key={selectedMovie.id} sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                  <TextField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    fullWidth
                    multiline={field === 'plot'}
                    value={newMovie[field]}
                    onChange={(e) => handleInputChange(e, setNewMovie)}
                    required
                  />
                </Box>
              ))}
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMovieDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={() => setIsMovieDialogOpen(true)}>
            Add New Movie
          </Button>
        </DialogActions>
        </Dialog>
          


        <Typography variant="h6" gutterBottom>Existing Movies</Typography>
        
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3, fontSize: "0.2rem" }}>
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <Card key={movie.id} onClick={() => setSelectedMovie(movie)} sx={{ cursor: "pointer", bgcolor: "#fff", transition: "0.3s", "&:hover": { bgcolor: "#f0f0f0" } }}>
              <CardMedia component="img" height="325" image={movie.poster} alt={movie.title} />
            </Card>
          ))
        ) : (
          <Typography>No movies found.</Typography>
        )}
        </Box>

        <Dialog open={!!selectedMovie} onClose={() => setSelectedMovie(null)} maxWidth="md" fullWidth>
          {selectedMovie && (
          <>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
                <Card key={selectedMovie.id} sx={{ cursor: "pointer", maxHeight: 220, maxWidth: 160 }}>
                  <CardMedia
                    component="img"
                    image={selectedMovie.poster}
                    alt={selectedMovie.title}
                    sx={{ height: "auto", width: "100%" }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2" noWrap>{selectedMovie.title}</Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box item xs={12} md={6} key={selectedMovie.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" flexDirection="column" gap={1}>
                    <Box
                      component="img"
                      src={selectedMovie.poster}
                      alt={selectedMovie.title}
                      sx={{
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'cover',
                        cursor: 'pointer',
                        borderRadius: 1,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => handleMovieEdit(movie)}
                    />
                      {editingMovieId === selectedMovie.id ? (
                        <>
                          {['title', 'plot', 'poster', 'year', 'genre'].map((field) => (
                            <TextField
                              key={field}
                              label={field.charAt(0).toUpperCase() + field.slice(1)}
                              name={field}
                              fullWidth
                              multiline={field === 'plot'}
                              value={editedMovie[field]}
                              onChange={(e) => handleInputChange(e, setEditedMovie)}
                            />
                          ))}
                          <Box mt={2} display="flex" gap={1}>
                            <Button variant="contained" onClick={() => handleMovieSave(movie.id)}>
                              Save
                            </Button>
                            <Button variant="outlined" onClick={() => setEditingMovieId(null)}>
                              Cancel
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => handleDeleteMovie(movie.id)}>
                              Delete
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6">{movie.title}</Typography>
                          <Typography>{movie.plot}</Typography>
                          <Typography>Year: {movie.year}</Typography>
                          <Typography>Genre: {movie.genre}</Typography>
                          <Box mt={1}>
                            <Button variant="outlined" onClick={() => handleMovieEdit(movie)}>
                              Edit
                            </Button>{' '}
                            <Button variant="outlined" color="error" onClick={() => handleDeleteMovie(movie.id)}>
                              Delete
                            </Button>
                          </Box>
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </DialogContent>
          </>
          )}
        </Dialog>
       
        {totalPages > 1 && (
        <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};

export default AdminMovies;
