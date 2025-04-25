import { useState, useEffect } from "react";
import { TextField, Box, Typography, Card, CardMedia, CardContent, Dialog, DialogContent, DialogTitle, Button, Pagination } from "@mui/material";
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
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

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

  const handleReviewSubmit = async(movieId) => {
    const token = localStorage.getItem("token");
    if(!token){
      alert("You must be logged in to add a Review.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user")); // or however you store user info
    if (!user?.id) {
      alert("User info not found.");
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
          userId: user.id,
          rating: 5,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Review added");
        setAddReview({ subject: "", description: "" });
      } else {
        alert(data.message || "Failed to add Review");
      }

    } catch (error) {
      console.error("Error adding Review", error);
    }
    setIsReviewDialogOpen(false);
  };

  const handleCommentSubmit = async (reviewId) => {
    try {
        const token = localStorage.getItem("token");
        if(!token){
          alert("You must be logged in to add a Review.");
          return;
        }
    
        const user = JSON.parse(localStorage.getItem("user")); // or however you store user info
        if (!user?.id) {
          alert("User info not found.");
          return;
        }

        const response = await fetch(`${API}/reviews/${reviewId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                subject: addComment.subject,
                description: addComment.description,
                userId: user.id,
            }),
        });

        const data = await response.json();

      if (response.ok) {
        alert("Comment added");
        setAddComment({ subject: "", description: "" });
      } else {
        alert(data.message || "Failed to add Comment");
      }

    } catch (error) {
      console.error("Error adding Comment", error);
    }
    setIsCommentDialogOpen(false);
    setActiveReviewId(null);
};

  const renderComments = (review) => {
    return (
        <>
            {Array.isArray(review.comments) && review.comments.length > 0 ? (
                review.comments.map((comment) => (
                  <div key={comment.id} style={{ marginLeft: "1rem", borderLeft: "2px solid #ccc", paddingLeft: "1rem", marginBottom: "1rem" }}>
                    <Typography variant="subtitle1">{`
                      ${comment.user.firstName} ${comment.user.lastName} wrote:`}</Typography>
                    <Typography variant="subtitle2">{comment.subject}</Typography>
                    <Typography variant="body2">{comment.description}</Typography>
                </div>
                ))
            ) : (
                <p style={{ fontStyle: "italic" }}>No comments available</p>
            )}
        </>
    );
  };

  // add to watchlist
  const handleAddToWatchlist = async(userId, movieId) =>{
    const token = localStorage.getItem("token");
    if(!token){
      setShowLoginDialog(true);
      return;
    }
    try{
      const response = await fetch(`${API}/watchlist`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({userId,movieId}),
        
      });

      const data = await response.text();
      if (response.ok) {
        alert("Movie added to Watchlist!");
        setAddedToWatchlist((prevState) =>({
          ...prevState,
          [movieId]:true,
        }));
      } else {
        try{
          const errorData = JSON.parse(data);
          alert(errorData.message || "Failed to add to Watchlist");

        }catch(error){
          alert(data || "Failed to add to Watchlist");
        // const error = await response.json();
        // alert(error.message || "Failed to add to Watchlist");
      }

      }

      }catch (error){
        console.error("Error adding to Watchlist:",error);
   }
    };

  const filteredMovies = movies.filter((movie) =>
    movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

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
{/* watchlist dialog */}
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>

        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>You must be logged in to add to your watchlist.</Typography>
          <Button onClick={() => setShowLoginDialog(false)} variant="contained"  sx={{ mt: 2 }}>Close</Button>
        </DialogContent>
      </Dialog>

      {/* Movie List */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3, fontSize: "0.2rem" }}>
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <Card key={movie.id} onClick={() => setSelectedMovie(movie)} sx={{ cursor: "pointer", bgcolor: "#fff", transition: "0.3s", "&:hover": { bgcolor: "#f0f0f0" } }}>
              <CardMedia component="img" height="325" image={movie.poster} alt={movie.title} />
              {/* <CardContent>
                <Typography variant="h6" sx={{fontSize: ".75rem"}}  >{movie.title}</Typography>
              </CardContent> */}
            </Card>
          ))
        ) : (
          <Typography>No movies found.</Typography>
        )}
      </Box>
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

      {/* Movie Details Dialog */}
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

            <Box sx={{ flex: 1}}>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Description:</strong> {selectedMovie.plot}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Rating:</strong> {selectedMovie.imdbRating}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>My Rating:</strong> {selectedMovie.userRatings}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Year:</strong> {selectedMovie.year}</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}><strong>Genre:</strong> {selectedMovie.genre}</Typography>
            </Box>
            </Box>
            <br></br>
            <Typography variant="body1"><strong>Reviews:</strong></Typography>
            {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
              selectedMovie.reviews.map((review) => (
                <Box key={review.id} sx={{ mb: 1 }}>
                  <Typography variant="subtitle1">{`
                    ${review.user.firstName} ${review.user.lastName} wrote:`}</Typography>
                  <Typography variant="subtitle1">{review.subject}</Typography>
                  <Typography variant="body2">{review.description}</Typography>
                  <Box sx={{ mt: 4 }}>
                  {renderComments(review)}
                  {isLoggedIn && (
                    <>
                      <Button onClick={() => {setActiveReviewId(review.id); setIsCommentDialogOpen(true)}}>Add a Comment</Button>
                    </>
                  )}
                  <Dialog open={isCommentDialogOpen} onClose={() => setIsCommentDialogOpen(false)}>

                    <DialogTitle>Add a Comment</DialogTitle>
                    <DialogContent>
                      <TextField
                        label="Subject"
                        fullWidth
                        value={addComment.subject}
                        onChange={(e) =>
                          setAddComment({ ...addComment, subject: e.target.value })
                        }
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={addComment.description}
                        onChange={(e) =>
                          setAddComment({ ...addComment, description: e.target.value })
                        }
                      />
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button onClick={() => setIsCommentDialogOpen(false)} color="error">
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            handleCommentSubmit(activeReviewId);
                          }}
                        >
                          Save
                        </Button>
                      </Box>
                    </DialogContent>
                  </Dialog>
                </Box>
                </Box>
              ))
              ) : (
                <Typography>No reviews yet.</Typography>
              )}
              <Typography variant="body1"><strong>Year:</strong> {selectedMovie.year}</Typography>
              <Typography variant="body1"><strong>Genre:</strong> {selectedMovie.genre}</Typography>
              <Button onClick={() => handleAddToWatchlist(selectedMovie.id)} sx={{ mt: 2,mr: 2 }} color="primary" variant="contained" disabled={!!addedToWatchlist[selectedMovie.id]} > {addedToWatchlist[selectedMovie.id] ? "Added to Watchlist ✓" : "Add to Watchlist"}</Button>

              {isLoggedIn && (
                <>
                  <Button onClick={() => handleAddToWatchlist(selectedMovie.id)} sx={{ mt: 2,mr: 2 }} color="primary" variant="contained" disabled={addedToWatchlist}>{addedToWatchlist ? "Added to Watchlist ✓" : "Add to Watchlist"}</Button>
                  <Button onClick={() => setIsReviewDialogOpen(true)}>Add Review</Button>
                </>
              )}
              <Button onClick={() => setSelectedMovie(null)} sx={{ mt: 2 }} color="error" variant="contained">Close</Button>
              <Dialog open={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false)}>
                <DialogTitle>Add a Review</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Subject"
                    fullWidth
                    value={addReview.subject}
                    onChange={(e) =>
                      setAddReview({ ...addReview, subject: e.target.value })
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={addReview.description}
                    onChange={(e) =>
                      setAddReview({ ...addReview, description: e.target.value })
                    }
                  />
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button onClick={() => setIsReviewDialogOpen(false)} color="error">
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleReviewSubmit(selectedMovie.id);
                        setIsReviewDialogOpen(false);
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                </DialogContent>
              </Dialog>
            </DialogContent>
          </>
        )}
          </Dialog>
      </Box>
      )
   };

export default Movies;