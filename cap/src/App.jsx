import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "./components/Navbar";
// import Login from "../components/Login";
// import Register from "../components/Register";
// import Profile from "../components/Profile";
// import TopRated from "/TopRated";
import Movies from "./components/Movies";


function App() {
  const [count, setCount] = useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <Container sx={{ flex: 1, mt: 4 }}>
        <Routes>
          <Route path="/" element={<Movies />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} /> */}

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
