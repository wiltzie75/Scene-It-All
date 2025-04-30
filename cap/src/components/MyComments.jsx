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
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

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
                  {comment.review?.movie?.title || "Untitled Movie"}
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
                  </>
                ) : (
                  <Typography sx={{ color: "#2B2D42" }}>
                    <strong>{comment.subject}:</strong> {comment.description}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} mt={2}>
                  {editingCommentId === comment.id ? (
                    <>
                      <Tooltip title="Save">
                        <IconButton
                          onClick={() => handleCommentSave(comment.id)}
                          sx={{ color: "#2B2D42" }}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton
                          onClick={handleCommentCancel}
                          sx={{ color: "#D90429" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleCommentEdit(comment)}
                          sx={{ color: "#8D99AE" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => removeComment(comment.id)}
                          sx={{ color: "#D90429" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MyComments;
