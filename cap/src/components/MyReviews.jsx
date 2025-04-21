import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const MyReviews = () => {

    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        favorites: [],
        reviews: [],
        comments: [],
        firstName: "",
        lastName: ""
    });

    const [users, setUsers] = useState([]);

    const [editedReview, setEditedReview] = useState({ subject: "", description: "" });
    const [editingReviewId, setEditingReviewId] = useState(null);

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

    const handleReviewEdit = (review) => {
        setEditingReviewId(review.id);
        setEditedReview({ subject: review.subject, description: review.description});
    };

    const handleReviewSave = async (reviewId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/reviews/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    subject: editedReview.subject,
                    description: editedReview.description
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

    const handleCommentEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditedComment({ subject: comment.subject, description: comment.description});
    };

    return ( 
        <>
        {/* Displays users reviews */}
        <div style={{border: '1px solid black'}}>
            {profile && profile.reviews.length === 0 ? (
                <div>
                    <h3>You have no reviews</h3>
                </div>
            ) : (
                <div>
                    <h3>My Reviews</h3>
                    {profile.reviews.map((review) => (
                        <div key={review.id}>
                            <h4>{review.movie?.title || "Untitled Movie"}</h4>
                            {editingReviewId === review.id ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        value={editedReview.subject}
                                        onChange={(e) =>
                                            setEditedReview({ ...editedReview, subject: e.target.value })
                                        }
                                    />
                                    <br />
                                    <textarea
                                        placeholder="Description"
                                        value={editedReview.description}
                                        onChange={(e) =>
                                            setEditedReview({ ...editedReview, description: e.target.value })
                                        }
                                    />
                                    <br />
                                    <button onClick={() => handleReviewSave(review.id)}>Save</button>
                                    <button onClick={handleReviewCancel}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <p>{review.subject}: {review.description}</p>
                                    <button onClick={() => handleReviewEdit(review)}>Edit</button>
                                    <button onClick={() => removeReview(review.id)}>Delete</button>
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
 
export default MyReviews;