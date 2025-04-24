import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
// import { watchlist } from "../../../prisma";
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
        watchlist:[]
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

    const handleRemoveFromWatchlist = async (movieId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return alert("You need to be logged in to remove movies to your Watchlist");
        }
        const userId = profile.id;

        try {
            const response = await fetch(`${API}/watchlist/${movieId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ movieId }), 
            });

            if (response.ok) {
                alert("Movie removed from Watchlist!");
                getProfile(); 
            } else {
                alert("Failed to remove movie from Watchlist");
            }
        } catch (error) {
            console.error("Error removing movie from Watchlist:", error);
        }
    };


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
            
            {/* Displays user's watchlist */}
            <div style={{ border:'1px solid black', marginTop: '20px' }}>

                {profile && profile.watchlist.length === 0 ? (
                    <div>
                        <h3>You have no movies in your Watchlist</h3>
                    </div>
                ) : (
                    <div>
                        <h3>My Watchlist</h3>
                        {profile.watchlist?.map((movie) => (
                            <div key={movie.id}>
                                <img src={movie.poster} alt={movie.title} />
                                <h4>{movie.title}</h4>
                                <p>Ratings: {movie.imdbRating}</p>
                                <button
                                     onClick={()=> handleRemoveFromWatchlist(movie.id)}
                                     style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                                     >
                                        Remove from Watchlist
                                     </button>
                            </div>
                                
                        ))}
                    </div>
                 )}
            </div>



        </>
    );
};

export default Profile;