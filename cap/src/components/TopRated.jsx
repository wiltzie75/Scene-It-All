import React, { useEffect, useState } from "react";

const TopRated = () => {
  const [movies, setMovies] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMovies = () => {
    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        const top10 = data.sort((a, b) => b.rating - a.rating).slice(0, 10);
        setMovies(top10);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setError("Failed to load top rated movies.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleRating = (userId, movieId, rating) => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/topRated", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ userId, movieId, rating }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Rating failed");
        return res.json();
      })
      .then(() => {
        setUserRatings((prev) => ({ ...prev, [movieId]: rating }));
        setSubmitted((prev) => ({ ...prev, [movieId]: true }));
        fetchMovies();
      })
      .catch((err) => {
        console.error("Error submitting rating:", err);
        alert("Something went wrong when submitting your rating.");
      });
  };

  if (loading) return <p>Loading top rated movies...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Top 10 Highest Rated Movies</h2>
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              boxSizing: "border-box",
              backgroundColor: "#f9f9f9",
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
            <h3>{movie.title}</h3>
            <p>
              <strong>Average Rating:</strong>{" "}
              {typeof movie.rating === "number"
                ? movie.rating.toFixed(1)
                : "N/A"}{" "}
              ⭐
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRated;
