const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Initialize Prisma Client

// Load environment variables
require('dotenv').config();

// Middleware setup (should come before routes)
app.use(cors({ origin: "*" }));
app.use(express.json());

// Logging middleware (moved to top to catch all requests)
app.use((req, res, next) => {
  console.log('Route accessed:', req.method, req.path);
  next();
}); 

app.get('/api/debug', async (req, res) => {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const movieCount = await prisma.movie.count();
    const reviewCount = await prisma.review.count();
    res.json({ 
      movies: movieCount, 
      reviews: reviewCount,
      dbUrl: process.env.DATABASE_URL ? 'Set' : 'Missing'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: error.message });
  }
});

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
// app.use(cors({ origin: "*" }));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://scene-it-all.onrender.com'
    : 'http://localhost:3000',
  credentials: true
}));

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

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});