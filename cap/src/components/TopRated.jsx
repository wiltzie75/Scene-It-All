import React, { useEffect, useState } from "react";

const TopRated = () => {
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        const top10 = data.sort((a, b) => b.rating - a.rating).slice(0, 10);
        setTopMovies(top10);
      });
  }, []);

  return (
    <div>
      <h2>Top 10 Movies</h2>
      <ul>
        {topMovies.map((movie) => (
          <li key={movie.id}>
            <strong>{movie.title}</strong> – {movie.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopRated;
