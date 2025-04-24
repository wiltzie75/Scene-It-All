import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import TopRated from "./components/TopRated";
import Home from "./components/Home";
import Movies from "./components/Movies";
import MyReviews from "./components/MyReviews";
import MyComments from "./components/MyComments";
import Users from "./components/Users";
import AdminMovies from './components/AdminMovies';
import Reviews from "./components/Reviews";

function App() {
  const [count, setCount] = useState(0);
  const [token, setToken] = useState(null);
  
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem("user");
  }
  const userRole = user?.isAdmin;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar token={token} setToken={setToken}/>

      <Container sx={{ flex: 1, mt: 4 }}>
        {/* Only show "Go to Admin Page" button if user is admin */}
        {/* {userRole === true && (
          <div className="admin-button" style={{ marginBottom: "16px" }}>
            <Link to="/admin">
              <button>Go to Admin Page</button>
            </Link>
          </div>
        )} */}
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/register" element={<Register token={token} setToken={setToken}/>} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/login" element={<Login token={token} setToken={setToken} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myreviews" element={<MyReviews />} />
            <Route path="/mycomments" element={<MyComments />} />
            <Route path="/users" element={<Users />} />
            
            {/*  Only show the admin page if the user is an admin  */}
            <Route path="/admin" element={user?.isAdmin ? <AdminMovies /> : <Navigate to="/" />} />
        </Routes>
      </Container>

      {/* <Footer /> */}
    </Box>
  );
}

export default App;
