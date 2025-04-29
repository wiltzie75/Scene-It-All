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
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

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
      return await response.json();
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
    if (APIResponse) setProfile(APIResponse);
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

    if (profile.isAdmin) fetchUsers();
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

  const removeReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) await getProfile();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 2 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#2B2D42", fontWeight: 700 }}
      >
        🎬 My Reviews
      </Typography>

      {profile && profile.reviews.length === 0 ? (
        <Typography align="center" sx={{ color: "#8D99AE" }}>
          You haven't written any reviews yet!
        </Typography>
      ) : (
        <Stack spacing={3}>
          {profile.reviews.map((review) => (
            <Card
              key={review.id}
              sx={{
                backgroundColor: "#EDF2F4",
                border: "2px solid #8D99AE",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Chip
                    label={review.movie?.title || "Untitled Movie"}
                    sx={{
                      backgroundColor: "#8D99AE",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  />
                  {editingReviewId !== review.id && (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleReviewEdit(review)}
                          sx={{ color: "#2B2D42" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => removeReview(review.id)}
                          sx={{ color: "#D90429" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </Stack>

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
                      sx={{ mb: 2, backgroundColor: "#fff" }}
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
                      sx={{ mb: 2, backgroundColor: "#fff" }}
                    />
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => handleReviewSave(review.id)}
                        sx={{
                          backgroundColor: "#2B2D42",
                          borderRadius: "8px",
                          "&:hover": { backgroundColor: "#8D99AE" },
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleReviewCancel}
                        sx={{
                          color: "#D90429",
                          borderColor: "#D90429",
                          borderRadius: "8px",
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
                  <Typography sx={{ color: "#2B2D42", mt: 1 }}>
                    <strong>{review.subject}:</strong> {review.description}
                  </Typography>
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
