import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
// import { favorite } from "../../../prisma";
// import { BottomNavigation } from "@mui/material";
// import { border } from "@mui/system";

const Profile = (props) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        favorites: [],
        reviews: [],
        comments: [],
        firstName: "",
        lastName: "",
    });
    const [users, setUsers] = useState([]);

    // Fetch profile data
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
    };

    const handleRemoveFromFavorite = async (movieId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return alert("You need to be logged in to remove movies to your Favorite");
        }
        const userId = profile.id;

        try {
            const response = await fetch(`${API}/favorite/${movieId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Movie removed from Favorite!");
                getProfile(); 
            } else {
                alert("Failed to remove movie from Favorite");
            }
        } catch (error) {
            console.error("Error removing movie from Favorite:", error);
        }
    };


    return ( 
        <>
            <div>
                {profile && (
                    <div>
                        <h2 style={{ textAlign: "center" }}>
                            Welcome {profile.firstName} {profile.lastName}
                        </h2>
                    </div>
                )}
            </div>
            
            {/* Displays user's favorite */}
                {profile && profile.favorites.length === 0 ? (
                    <div>
                        <h3>You have no movies in your Favorite</h3>
                    </div>
                ) : (
                    <div>
                        <h3>My Favorites</h3>
                        {profile.favorites?.map((favorite) => (
                            <div key={favorite.id}>
                            <img src={favorite.movie?.poster} alt={favorite.movie?.title || "No title"} />
                            <h4>{favorite.movie?.title || "No Title Available"}</h4>
                            <p>Ratings: {favorite.movie?.userRatings || "N/A"}</p>
                            <button
                              onClick={() => handleRemoveFromFavorite(favorite.movieId)}
                              style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                            >
                              Remove from Favorite
                            </button>
                          </div>
                                
                        ))}
                    </div>
                )}
        </>
    );
};

export default Profile;