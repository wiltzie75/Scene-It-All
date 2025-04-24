import { useState, useEffect } from "react";
import { TextField, Box, Typography, Card, CardMedia, CardContent, Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import "../App.css";
import API from "../api/api";
// import { hasCustomParams } from "react-admin";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addedToWatchlist,setAddedToWatchlist] = useState({});
  const [addReview, setAddReview] = useState({ subject: "", description: ""});
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [addComment, setAddComment] = useState({ subject: "", description: ""});

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

  const handleReviewSubmit = async(reviewId) => {
    const token = localStorage.getItem("token");
    if(!token){
      alert("You must be logged in to add a Review.");
      return;
    }
    try {
      const response = await fetch(`${API}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId,
          subject: addReview.subject,
          description: addReview.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Review added");
        setAddReview({ subject: "", description: "" });
      } else {
        const error = await response.json();
        alert(error.message || "Failed to add Review");
      }

    } catch (error) {
      console.error("Error adding Review", error);
    }
  };

  const renderComments = (review) => {
    return (
        <>
            {Array.isArray(review.comments) && review.comments.length > 0 ? (
                review.comments.map((comment) => (
                    <div key={comment.id} style={{ marginLeft: "1rem", borderLeft: "2px solid #ccc", paddingLeft: "1rem", marginBottom: "1rem" }}>
                    </div>
                ))
            ) : (
                <p style={{ fontStyle: "italic" }}>No comments available</p>
            )}
        </>
    );
};
  // add to watchlist
  const handleAddToWatchlist = async(movieId) =>{
    const token = localStorage.getItem("token");
    if(!token){
      alert("You must be logged in to add to Watchlist.");
      return;
    }
    try{
      const response = await fetch(`${API}/watchlist`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({movieId}),
        
      });
      if (response.ok) {
        alert("Movie added to Watchlist!");
        setAddedToWatchlist((prevState) =>({
          ...prevState,
          [movieId]:true,
        }));
      } else {
        const error = await response.json();
        alert(error.message || "Failed to add to Watchlist");
      }

      }catch (error){
        console.error("Error adding to Watchlist:",error);
   }
    };

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
              <Typography variant="body1" sx={{ mt: 2 }}><strong>Description:</strong> {selectedMovie.plot}</Typography>
              <Typography variant="body1"><strong>Rating:</strong> {selectedMovie.imdbRating}</Typography>
              <Typography variant="body1"><strong>My Rating:</strong> {selectedMovie.userRatings}</Typography>
              {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
                selectedMovie.reviews.map((review) => (
                  <Box key={review.id} sx={{ mt: 2 }}>
                    <Typography variant="body1"><strong>Reviews:</strong></Typography>
                    <Typography variant="subtitle1">{review.subject}</Typography>
                    <Typography variant="body2">{review.description}</Typography>
                    <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Comments
                    </Typography>
                    {renderComments(review)}
                  </Box>
                  </Box>
                ))
              ) : (
                <Typography>No reviews yet.</Typography>
              )}
              <Typography variant="body1"><strong>Year:</strong> {selectedMovie.year}</Typography>
              <Typography variant="body1"><strong>Genre:</strong> {selectedMovie.genre}</Typography>
              <Button onClick={() => handleAddToWatchlist(selectedMovie.id)} sx={{ mt: 2,mr: 2 }} color="primary" variant="contained" disabled={addedToWatchlist}>{addedToWatchlist ? "Added to Watchlist ✓" : "Add to Watchlist"}</Button>
              <Button onClick={() => setIsReviewDialogOpen(true)}>Add Review</Button>
                <Dialog open={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false) fullWidth maxWidth="sm">
                <DialogTitle>Add Your Review</DialogTitle>
                <DialogContent>
                <Box>
                  <TextField
                      type="text"
                      placeholder="Subject"
                      value={editedReview.subject}
                      onChange={(e) =>
                          setEditedReview({ ...editedReview, subject: e.target.value })
                      }
                  />
                  <TextField
                      placeholder="Description"
                      value={editedReview.description}
                      onChange={(e) =>
                          setEditedReview({ ...editedReview, description: e.target.value })
                      }
                  />
                </Box>
                </DialogContent>
                <Box>
                  <Button onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleReviewCancel}>Cancel</button>
                </Box>
              <Button onClick={() => setSelectedMovie(null)} sx={{ mt: 2 }} color="error" variant="contained">Close</Button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Movies;