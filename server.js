const express = require('express'); // 引入 Express
const app = express(); // 创建 Express 应用实例
const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// Use middleware to parse JSON request body
app.use(express.json());

// Set up routes
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Set the server port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});