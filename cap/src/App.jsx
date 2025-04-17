import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
// import Navbar from "../components/Navbar";
<<<<<<< HEAD
// import Login from "../components/Login";
import Register from "./components/Register"
=======
import Login from "./components/Login";
// import Register from "../components/Register";
>>>>>>> b47342e9304e55258fcacf5bcf3f8fdd61233293
// import Profile from "../components/Profile";
// import TopRated from "/TopRated";
import Movies from "./components/Movies";

function App() {
  const [count, setCount] = useState(0);
  const [token, setToken] = useState(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* <Navbar /> */}

      <Container sx={{ flex: 1, mt: 4 }}>
        <Routes>
          <Route path="/" element={<Movies />} />
<<<<<<< HEAD
          <Route path="/users/register" element={<Register token={token} setToken={setToken}/>} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} /> */}

=======
          <Route
            path="/users/login"
            element={<Login token={token} setToken={setToken} />}
          />
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
>>>>>>> b47342e9304e55258fcacf5bcf3f8fdd61233293
          {/* <Route path="/top rated" element={<TopRated />} /> */}
          {/* <Route
            path="/admin"
            element={isLoggedIn ? <AdminPanel /> : <Navigate to="/" />}
          /> */}
        </Routes>
      </Container>

      {/* <Footer /> */}
    </Box>
  );
}

export default App;
