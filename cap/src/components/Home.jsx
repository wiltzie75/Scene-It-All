import { useState, useEffect } from 'react';
import '../App.css';
import API from '../api/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  // const [selectedMovie, setSelectedMovie] = useState(null);

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
    <div className="floating-wrapper">
      <h1 className="site-title" >SCENE IT ALL</h1>
      {movies.map((movie, index) => (
        <img
          key={index}
          src={movie.poster}
          alt={movie.title}
          className="floating-poster"
          style={{
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 90}vw`,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDirection: Math.random() > 0.5 ? 'normal' : 'reverse',
            width: `${100 + Math.random() * 150}px`,
            opacity: Math.random() * 0.5 + 0.3,
          }}
        />
      ))}
    </div>

  );
};

export default Home;
