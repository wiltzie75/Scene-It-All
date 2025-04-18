import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Movies from "./Movies";

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [favorites, setFavorites] = useState([]);

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
                navigate("/login"); // optional
                return;
            }
    
            const APIResponse = await fetchProfile(token);
            if (APIResponse) {
                setProfile(APIResponse);
            }
        }
        getProfile();
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`${API}/top-rated`);
                const data = await response.json();
                setFavorites(data);
            } catch (error) {
                console.log("Error fetching your favorite movies:", error);
            }
        };
        fetchFavorites();
    }, []);

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

            <div>
                {favorites.length === 0 ? (
                    <div>
                        <h3>You have no Favorites</h3>
                    </div>
                ) : (
                    <div>
                        <h3>My Favorite Movies</h3>
                        {favorites.map((movie, index) => (
                            <div key={movie.id}>
                                <img src={movie.poster} alt={movie.title} />
                                <h4>{movie.title}</h4>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;