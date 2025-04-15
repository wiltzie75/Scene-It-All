const express = require("express")
const app = express();
const cors = require("cors");
const prisma = require("./prisma");

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;
// const verifyToken = require('./verify')
app.use(express.json());
app.use(require("morgan")("dev"));

app.use(cors({ origin: "*" }));

// GET all movies
app.get("/api/movie", async (req, res, next) => {
    try {
        const movie = await prisma.movie.findMany();
        res.json(movie)
    } catch (error) {
        next(error)
    }
});

// GET comments
app.get("/api/comment", async (req, res, next) => {
    try {
        const comment = await prisma.comment.findMany();
        res.json(comment)
    } catch (error) {
        next(error)
    }
});

// // GET reviews
app.get("/api/review", async (req, res, next) => {
    try {
        const review = await prisma.review.findMany();
        res.json(review)
    } catch (error) {
        next(error)
    }
});

// // GET users
app.get("/api/user", async (req, res, next) => {
    try {
        const user = await prisma.user.findMany();
        res.json(user)
    } catch (error) {
        next(error)
    }
});


app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
  });