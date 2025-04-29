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

const MyComments = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    favorites: [],
    reviews: [],
    comments: [],
    firstName: "",
    lastName: "",
  });

  const [users, setUsers] = useState([]);

  const [editedComment, setEditedComment] = useState({
    subject: "",
    description: "",
  });
  const [editingCommentId, setEditingCommentId] = useState(null);

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

  const handleCommentEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditedComment({
      subject: comment.subject,
      description: comment.description,
    });
  };

  const handleCommentSave = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: editedComment.subject,
          description: editedComment.description,
        }),
      });

      if (res.ok) {
        await getProfile();
        const updatedComments = profile.comments.map((c) => c);
        setProfile({ ...profile, comments: updatedComments });
        setEditingCommentId(null);
        setEditedComment({ subject: "", description: "" });
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleCommentCancel = () => {
    setEditingCommentId(null);
    setEditedComment({ subject: "", description: "" });
  };

  async function removeComment(commentId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/comments/${commentId}`, {
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
        My Comments
      </Typography>

      {profile && profile.comments?.length === 0 ? (
        <Typography align="center" sx={{ color: "#EDF2F4" }}>
          You have no comments.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {profile.comments?.map((comment) => (
            <Card
              key={comment.id}
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
                  {comment.review?.movie?.title}
                </Typography>

                {editingCommentId === comment.id ? (
                  <>
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      value={editedComment.subject}
                      onChange={(e) =>
                        setEditedComment({
                          ...editedComment,
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
                      value={editedComment.description}
                      onChange={(e) =>
                        setEditedComment({
                          ...editedComment,
                          description: e.target.value,
                        })
                      }
                      sx={{ marginBottom: "1rem", backgroundColor: "#fff" }}
                    />
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={() => handleCommentSave(comment.id)}
                        sx={{
                          backgroundColor: "#2B2D42",
                          "&:hover": { backgroundColor: "#8D99AE" },
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCommentCancel}
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
                      <strong>{comment.subject}:</strong> {comment.description}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={() => handleCommentEdit(comment)}
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
                        onClick={() => removeComment(comment.id)}
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

export default MyComments;
