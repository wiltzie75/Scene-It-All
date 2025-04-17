import { useState, useEffect } from 'react';
import '../App.css';
import API from '../api/api';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Replace this with your API URL
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API}/movie`);
        const data = await response.json();
        console.log(data);
        
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="slider-container">
      <div className="slider">
        {movies.map((movie, index) => (
          <div key={index} className="slider-item">
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
