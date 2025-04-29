import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

const MyReviews = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    favorites: [],
    reviews: [],
    comments: [],
    firstName: "",
    lastName: "",
  });

  const [users, setUsers] = useState([]);
  const [editedReview, setEditedReview] = useState({
    subject: "",
    description: "",
  });
  const [editingReviewId, setEditingReviewId] = useState(null);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(`${API}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const APIResponse = await fetchProfile(token);
    if (APIResponse) {
      setProfile(APIResponse);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    if (profile.isAdmin) {
      fetchUsers();
    }
  }, [profile.isAdmin]);

  const handleReviewEdit = (review) => {
    setEditingReviewId(review.id);
    setEditedReview({
      subject: review.subject,
      description: review.description,
    });
  };

  const handleReviewSave = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: editedReview.subject,
          description: editedReview.description,
        }),
      });

      if (res.ok) {
        await getProfile();
        const updatedReviews = profile.reviews.map((r) =>
          r.id === reviewId ? { ...r, ...editedReview } : r
        );
        setProfile({ ...profile, reviews: updatedReviews });
        setEditingReviewId(null);
        setEditedReview({ subject: "", description: "" });
      }
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleReviewCancel = () => {
    setEditingReviewId(null);
    setEditedReview({ subject: "", description: "" });
  };

  async function removeReview(reviewId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await getProfile();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#2B2D42" }}
      >
        My Reviews
      </Typography>

      {profile && profile.reviews.length === 0 ? (
        <Typography align="center" sx={{ color: "#EDF2F4" }}>
          You have no reviews.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {profile.reviews.map((review) => (
            <Card
              key={review.id}
              sx={{
                backgroundColor: "#EDF2F4",
                border: "1px solid #8D99AE",
                borderRadius: "12px",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: "#2B2D42", marginBottom: "0.5rem" }}
                >
                  {review.movie?.title || "Untitled Movie"}
                </Typography>

                {editingReviewId === review.id ? (
                  <>
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      value={editedReview.subject}
                      onChange={(e) =>
                        setEditedReview({
                          ...editedReview,
                          subject: e.target.value,
                        })
                      }
                      sx={{ marginBottom: "1rem", backgroundColor: "#fff" }}
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      multiline
                      minRows={3}
                      value={editedReview.description}
                      onChange={(e) =>
                        setEditedReview({
                          ...editedReview,
                          description: e.target.value,
                        })
                      }
                      sx={{ marginBottom: "1rem", backgroundColor: "#fff" }}
                    />
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={() => handleReviewSave(review.id)}
                        sx={{
                          backgroundColor: "#2B2D42",
                          "&:hover": { backgroundColor: "#8D99AE" },
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleReviewCancel}
                        sx={{
                          color: "#D90429",
                          borderColor: "#D90429",
                          "&:hover": {
                            backgroundColor: "#EF233C",
                            color: "#fff",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography
                      sx={{ color: "#2B2D42", marginBottom: "0.5rem" }}
                    >
                      <strong>{review.subject}:</strong> {review.description}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={() => handleReviewEdit(review)}
                        sx={{
                          backgroundColor: "#8D99AE",
                          "&:hover": {
                            backgroundColor: "#2B2D42",
                            color: "#fff",
                          },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => removeReview(review.id)}
                        sx={{
                          color: "#D90429",
                          borderColor: "#D90429",
                          "&:hover": {
                            backgroundColor: "#EF233C",
                            color: "#fff",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MyReviews;
