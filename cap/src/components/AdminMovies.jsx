import { useState, useEffect } from 'react';
import '../App.css';
import API from '../api/api';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    poster: '',
    year: '',
    genre: '',
  });

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

  return (
    <div className="admin-movies-container">
      <h1>Admin Movie Management</h1>

      <form onSubmit={handleAddMovie}>
        <h2>Add New Movie</h2>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={newMovie.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="plot"
            value={newMovie.plot}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Poster Image URL</label>
          <input
            type="text"
            name="poster"
            value={newMovie.poster}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* <div>
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            value={newMovie.rating}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Reviews</label>
          <input
            type="number"
            name="reviews"
            value={newMovie.reviews}
            onChange={handleInputChange}
            required
          />
        </div> */}
        <div>
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={newMovie.year}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Genre</label>
          <input
            type="text"
            name="genre"
            value={newMovie.genre}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Movie</button>
      </form>

      <h2>Existing Movies</h2>
      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
            <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMovies;
