import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
// import { border } from "@mui/system";



const Profile = (props) => {
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

    // function that handles boolean toggle for Admin users
    const handleAdminToggle = async (userId, currentStatus) => {
        const token = localStorage.getItem("token");
        
        try {
            const response = await fetch(`${API}/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isAdmin: !currentStatus})
            });

            if (response.ok) {
                const updatedUsers = users.map((u) => 
                u.id === userId ? { ...u, isAdmin: !currentStatus } : u 
            );
            setUsers(updatedUsers);
            }
        } catch (error) {
            console.error("Failed to toggle admin:", error);
        }
    }

    // function that allows user to edit reviews
    const handleReviewEdit = (review) => {
        setEditingReviewId(review.id);
        setEditedReview({ subject: review.subject, description: review.description});
    };

    // function that allows user to save edited reviews
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

    // function that allows user to cancel editing a review
    const handleReviewCancel = () => {
        setEditingReviewId(null);
        setEditedReview({ subject: "", description: "" });
    };

    // function that allows a user to delete a review they have written
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

    // function that allows a user to edit comments they have written
    const handleCommentEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditedComment({ subject: comment.subject, description: comment.description});
    };

    // function that allows a user to save edited comments
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

    // function that lets user cancel editing comments
    const handleCommentCancel = () => {
        setEditingCommentId(null);
        setEditedComment({ subject: "", description: ""});
    };

    // function that allows user to delete comments they have written
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
            <div style={{border: '1px solid black'}}>
                {profile && (
                    <div>
                        <h2 style={{ textAlign: "center" }}>
                            Welcome {profile.firstName} {profile.lastName}
                        </h2>
                    </div>
                )}
            </div>

            {/* Displays users favorite movies */}
            <div style={{border: '1px solid black'}}>
                {profile && profile.favorites.length === 0 ? (
                    <div>
                        <h3>You have no Favorites</h3>
                    </div>
                ) : (
                    <div>
                        <h3>My Favorite Movies</h3>
                        {profile.favorites?.map((movie) => (
                            <div key={movie.id}>
                                <img src={movie.movie?.poster} alt={movie.movie?.title} />
                                <h4>{movie.movie?.title}</h4>
                                <p>Ratings: {movie.movie?.imdbRating} My rating: {movie.movie?.userRatings}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                                <h4>{review.movie?.title}</h4>
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

            {/* For Admin users, this will display a list of users, their review counts and Admin status */}
            <div style={{border: '1px solid black'}}>
                {profile && profile.isAdmin === true && (
                    <div>
                        <h2>Admin Panel</h2>
                        <div>
                            <ul>
                            {users && users.map((user) => (
                                <li key={user.id}>
                                    {user.firstName} {user.lastName} | {user.email} | Reviews: {user.reviews?.length || 0 } | Admin: {user.isAdmin ? "Yes" : "No"}{ " " }
                                    <button onClick={() => handleAdminToggle(user.id, user.isAdmin)}>
                                        {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                                    </button>
                                </li>
                            ))}
                            </ul>
                        </div>
                    
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;