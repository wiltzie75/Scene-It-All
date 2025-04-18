import { useState, useEffect } from 'react';
import '../App.css';
import API from '../api/api';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  return (
    <div className="movies-container">
      <div className="slider-container" style={{ position: 'relative' }}>
        <div className="slider">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="slider-item"
              onClick={() => setSelectedMovie(movie)}
            >
              <img src={movie.poster} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <div
            className="movie-overlay"
            onClick={() => setSelectedMovie(null)}
          >
            <div className="movie-overlay-content">
              <button
                className="close-button"
                onClick={(e) => {
                  // Prevent the click from bubbling up, then close.
                  e.stopPropagation();
                  setSelectedMovie(null);
                }}
              >
                X
              </button>
              <h2>{selectedMovie.title}</h2>
              {/* Only the image is protected from closing the overlay */}
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                onClick={(e) => e.stopPropagation()}
              />
              <p>
                <strong>Description:</strong> {selectedMovie.description}
              </p>
              <p>
                <strong>Rating:</strong> {selectedMovie.rating}
              </p>
              <p>
                <strong>Reviews:</strong> {selectedMovie.reviews}
              </p>
              <p>
                <strong>Year:</strong> {selectedMovie.year}
              </p>
              <p>
                <strong>Genre:</strong> {selectedMovie.genre}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
