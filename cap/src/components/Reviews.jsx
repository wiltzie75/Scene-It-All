import { useState, useEffect } from 'react';
import '../App.css';
import API from '../api/api';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [editedReview, setEditedReview] = useState({ subject: "", description: "" });
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [users, setUsers] = useState(JSON.parse(localStorage.getItem("user")));
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const fetchReviews = async () => {
            try {
            const response = await fetch(`${API}/reviews`);
            const data = await response.json();
            setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
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

    return ( 
        <>
            {/* Displays all reviews */}
            <div>
                {users?.isAdmin ? (
                    reviews.map((review) => (
                        <div key={review.id}>
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
                                <div>
                                    <p>{review.subject}: {review.description}</p>
                                    <button onClick={() => handleReviewEdit(review)}>Edit</button>
                                    <button onClick={() => removeReview(review.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                        ))
                    ) : (
                        reviews.map((review) => (
                        <div>
                            <p>{movie.title}</p>
                            <p>{review.subject}</p>
                            <p>{review.description}</p>
                            {review.comments && review.comments.map((comment) => (
                                <div key={comment.id}>
                                    <p>{comment.subject}</p>
                                    <p>{comment.description}</p>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </>
     );
}
 
export default Reviews;