const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express(); 

const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');
const favoriteRoutes = require('./routes/favorite');
// const recentReviewsRoutes = require('./routes/recentReviews');
const topRatedRoutes = require('./routes/topRated');
const profileRoutes = require('./routes/profile');
const ratingsRoutes = require('./routes/ratings');
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
app.use('/api/favorite', favoriteRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/topRated', topRatedRoutes);
app.use('/api/ratings', ratingsRoutes);

try {
  console.log('Loading movie routes...');
  const movieRoutes = require('./routes/movie');
  app.use('/api/movies', movieRoutes);
  console.log('Movie routes loaded successfully');
} catch (error) {
  console.error('Error loading movie routes:', error.message);
}

try {
  console.log('Loading review routes...');
  const reviewRoutes = require('./routes/reviews');
  app.use('/api/reviews', reviewRoutes);
  console.log('Review routes loaded successfully');
} catch (error) {
  console.error('Error loading review routes:', error.message);
}

try {
  console.log('Loading user routes...');
  const userRoutes = require('./routes/users');
  app.use('/api/users', userRoutes);
  console.log('User routes loaded successfully');
} catch (error) {
  console.error('Error loading user routes:', error.message);
}

try {
  console.log('Loading auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  console.log('Loading comment routes...');
  const commentsRoutes = require('./routes/comments');
  app.use('/api/comments', commentsRoutes);
  console.log('Comment routes loaded successfully');
} catch (error) {
  console.error('Error loading comment routes:', error.message);
}

try {
  console.log('Loading favorite routes...');
  const favoriteRoutes = require('./routes/favorite');
  app.use('/api/favorite', favoriteRoutes);
  console.log('Favorite routes loaded successfully');
} catch (error) {
  console.error('Error loading favorite routes:', error.message);
}

try {
  console.log('Loading top rated routes...');
  const topRatedRoutes = require('./routes/topRated');
  app.use('/api/topRated', topRatedRoutes);
  console.log('Top rated routes loaded successfully');
} catch (error) {
  console.error('Error loading top rated routes:', error.message);
}

try {
  console.log('Loading profile routes...');
  const profileRoutes = require('./routes/profile');
  app.use('/api/profile', profileRoutes);
  console.log('Profile routes loaded successfully');
} catch (error) {
  console.error('Error loading profile routes:', error.message);
}

try {
  console.log('Loading ratings routes...');
  const ratingsRoutes = require('./routes/ratings');
  app.use('/api/ratings', ratingsRoutes);
  console.log('Ratings routes loaded successfully');
} catch (error) {
  console.error('Error loading ratings routes:', error.message);
}

// Serve static files from React build (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'cap/dist')));
  
// Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'cap/dist/index.html'));
  });
}
 
// Set the server port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

