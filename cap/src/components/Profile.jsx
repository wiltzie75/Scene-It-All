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
                                <p>Ratings: {movie.movie?.imdbRating}{movie.movie?.userRatings}</p>
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