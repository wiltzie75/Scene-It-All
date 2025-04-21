const express = require('express');
const cors = require("cors");
const app = express(); 
const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');
const watchlistRoutes = require('./routes/watchlist');
// const recentReviewsRoutes = require('./routes/recentReviews');
const topRatedRoutes = require('./routes/topRated');
const profileRoutes = require('./routes/profile');
app.use(cors({ origin: "*" }));
require('dotenv').config();
// set api
// Use middleware to parse JSON request body
app.use(express.json());

// Set up routes
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/comments',commentsRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/topRated', topRatedRoutes);
 
// Set the server port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

