import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Movies from "./Movies";
import { border } from "@mui/system";

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        favorites: [],
        reviews: [],
        comments: [],
        firstName: "",
        lastName: ""
    });
    const [users, setUsers] = useState([]);

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

    useEffect(() => {
        async function getProfile() {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
    
            const APIResponse = await fetchProfile(token);
            if (APIResponse) {
                setProfile(APIResponse);
            }
        }
        getProfile();
    }, []);

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
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                                <p>{review.subject}: {review.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>


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
                                <p>{comment.subject}: {comment.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{border: '1px solid black'}}>
                {profile && profile.isAdmin === true && (
                    <div>
                        <h2>Admin Panel</h2>
                        <div>
                            {users && users.userIds.map((userId)) => (
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                            )}
                        </div>
                    
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;