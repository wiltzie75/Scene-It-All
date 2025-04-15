import { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Container } from "@mui/material";

function App() {
  const [count, setCount] = useState(0)

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
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/top rated" element={<TopRated />} />
          {/* <Route
            path="/admin"
            element={isLoggedIn ? <AdminPanel /> : <Navigate to="/" />}
          /> */}
        </Routes>
      </Container>

      {/* <Footer /> */}
    </Box>
  )
}

export default App
