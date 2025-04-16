const express = require('express');
const app = express(); 
const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');


app.use(express.json());

// set api
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/comments',commentsRoutes);
 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});