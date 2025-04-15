const express = require('express'); // 引入 Express
const app = express(); // 创建 Express 应用实例
const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// 使用中间件解析 JSON 请求体
app.use(express.json());

// 设置路由
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// 设置服务器端口并启
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});