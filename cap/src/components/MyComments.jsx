import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const MyComments = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        favorites: [],
        reviews: [],
        comments: [],
        firstName: "",
        lastName: ""
    });

    const [users, setUsers] = useState([]);

    const [editedComment, setEditedComment] = useState({ subject: "", description: "" });
    const [editingCommentId, setEditingCommentId] = useState(null);

    const fetchProfile = async (token) => {
        try {
            const response = await fetch(`${API}/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`},
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
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
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
        setEditedComment({ subject: comment.subject, description: comment.description});
    };

    const handleCommentSave = async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/comments/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    subject: editedComment.subject,
                    description: editedComment.description
                }),
            });

            if (res.ok) {
                await getProfile(); 
                const updatedComments = profile.comments.map((c) => c
                );
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
        setEditedComment({ subject: "", description: ""});
    };

    async function removeComment(commentId) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                await getProfile();
            }
        } catch (error) {
            console.error(error);
        }    
    }

    return ( 
        <>
            {/* Displays users comments */}
            <div style={{border: '1px solid black'}}>
                {profile && profile.comments.length === 0 ? (
                    <div>
                        <h3>You have no comments</h3>
                    </div>
                ) : (
                    <div>
                        <h3>My Comments</h3>
                        {profile.comments.map((comment) => (
                            <div key={comment.id}>
                                <h4>{comment.review?.movie?.title}</h4>
                                {editingCommentId === comment.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Subject"
                                            value={editedComment.subject}
                                            onChange={(e) =>
                                                setEditedComment({ ...editedComment, subject: e.target.value })
                                            }
                                        />
                                        <br />
                                        <textarea
                                            placeholder="Description"
                                            value={editedComment.description}
                                            onChange={(e) =>
                                                setEditedComment({ ...editedComment, description: e.target.value })
                                            }
                                        />
                                        <br />
                                        <button onClick={() => handleCommentSave(comment.id)}>Save</button>
                                        <button onClick={handleCommentCancel}>Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <p>{comment.subject}: {comment.description}</p>
                                        <button onClick={() => handleCommentEdit(comment)}>Edit</button>
                                        <button onClick={() => removeComment(comment.id)}>Delete</button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
     );
}
 
export default MyComments;