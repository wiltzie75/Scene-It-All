import { useState, useEffect } from 'react';
import '../App.css';
import API from '../api/api';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [editedReview, setEditedReview] = useState({ subject: "", description: "" });
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedComment, setEditedComment] = useState({ subject: "", description: "" });
    const [editingCommentId, setEditingCommentId] = useState(null);
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
                const updatedReviews = reviews.map((r) => 
                    r.id === reviewId ? { ...r, ...editedReview } : r
                );
                setReviews(updatedReviews);
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
                setReviews(reviews.filter(r => r.id !== reviewId));
            }
        } catch (error) {
            console.error(error);
        }    
    }

    const handleCommentEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditedComment({ subject: comment.subject, description: comment.description});
    };

    const handleCommentSave = async (reviewId, commentId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/reviews/${reviewId}/comments/${commentId}`, {
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
                const updatedReviews = reviews.map((review) => {
                    if (review.id === reviewId) {
                        const updatedComments = review.comments.map((comment) => 
                            comment.id === commentId ? { ...comment, ...editedComment } : comment
                        );
                        return { ...review, comments: updatedComments };
                    }
                    return review;
                });
                
                setReviews(updatedReviews);
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
            const response = await fetch(`${API}/reviews/${reviewId}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const updatedReviews = reviews.map((review) => {
                    if (review.id === reviewId) {
                        const updatedComments = review.comments.filter(comment => comment.id !== commentId);
                        return { ...review, comments: updatedComments };
                    }
                    return review;
                });
                
                setReviews(updatedReviews);
            }
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }     
    }

    const renderComments = (review) => {
        return (
            <>
                {Array.isArray(review.comments) && review.comments.length > 0 ? (
                    review.comments.map((comment) => (
                        <div key={comment.id} style={{ marginLeft: "1rem", borderLeft: "2px solid #ccc", paddingLeft: "1rem", marginBottom: "1rem" }}>
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
                                    <button onClick={() => handleCommentSave(review.id, comment.id)}>Save</button>
                                    <button onClick={handleCommentCancel}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <p><strong>{comment.subject}</strong></p>
                                    <p>{comment.description}</p>
                                    {users?.isAdmin && (
                                        <div>
                                            <button onClick={() => handleCommentEdit(comment)}>Edit Comment</button>
                                            <button onClick={() => removeComment(review.id, comment.id)}>Delete Comment</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{ fontStyle: "italic" }}>No comments available</p>
                )}
            </>
        );
    };

    return ( 
        <>
            {/* Displays all reviews */}
            <div>
                {users?.isAdmin ? (
                    reviews.map((review) => (
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
                                <div>
                                    <p>{review.subject}: {review.description}</p>
                                    <div>
                                        <h5>Comments</h5>
                                        {renderComments(review)}
                                    </div>
                                    <button onClick={() => handleReviewEdit(review)}>Edit</button>
                                    <button onClick={() => removeReview(review.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                        ))
                    ) : (
                        reviews.map((review) => (
                        <div key={review.id}>
                            <h4>{review.movie?.title || "Untitled Movie"}</h4>
                            <p>{review.subject}</p>
                            <p>{review.description}</p>
                            {renderComments(review)}
                        </div>
                    ))
                )}
            </div>
        </>
     );
}
 
export default Reviews;