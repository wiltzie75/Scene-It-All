const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://scene-it-all.onrender.com'
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Route accessed:', req.method, req.path);
  next();
}); 

// Debug route
app.get('/api/debug', async (req, res) => {
  try {
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

// Import route files
const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');
const favoriteRoutes = require('./routes/favorite');
const topRatedRoutes = require('./routes/topRated');
const profileRoutes = require('./routes/profile');
const ratingsRoutes = require('./routes/ratings');

// *** API ROUTES MUST COME FIRST ***
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);  // This is your auth routes!
app.use('/api/comments', commentsRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/topRated', topRatedRoutes);
app.use('/api/ratings', ratingsRoutes);

// *** STATIC FILES AND CATCH-ALL MUST COME AFTER API ROUTES ***
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'cap/dist')));
  
  // This catch-all should be the VERY LAST route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'cap/dist/index.html'));
  });
}

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