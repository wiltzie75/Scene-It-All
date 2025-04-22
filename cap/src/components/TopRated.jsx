import React, { useEffect, useState } from "react";

const TopRated = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [submitted, setSubmitted] = useState({});
  useEffect(() => {
    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        const top10 = data.sort((a, b) => b.rating - a.rating).slice(0, 10);
        setTopMovies(top10);
      });
  }, []);

  const handleRating = (movieId, rating) => {
    fetch("http://localhost:3000/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId, rating }),
    })
      .then((res) => res.json())
      .then(() => {
        setUserRatings((prev) => ({ ...prev, [movieId]: rating }));
        setSubmitted((prev) => ({ ...prev, [movieId]: true }));
      })
      .catch((err) => {
        console.error("Error submitting rating", err);
        alert("Failed to submit rating.");
      });
  };

  return (
    <div>
      <h2>Top 10 Highest Rated Movies</h2>
      <ul>
        {topMovies.map((movie) => (
          <li key={movie.id} style={{ marginBottom: "1.5rem" }}>
            <h3>{movie.title}</h3>
            <p>
              <strong>Average Rating:</strong> {movie.rating}
            </p>

            <div>
              <p style={{ marginBottom: "0.3rem" }}>Your Rating:</p>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(movie.id, value)}
                  disabled={submitted[movie.id]}
                  style={{
                    fontSize: "1.5rem",
                    color:
                      value <= (userRatings[movie.id] || 0) ? "gold" : "gray",
                    background: "none",
                    border: "none",
                    cursor: submitted[movie.id] ? "default" : "pointer",
                  }}
                >
                  ★
                </button>
              ))}
              {submitted[movie.id] && <p>Thanks for rating!</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopRated;
