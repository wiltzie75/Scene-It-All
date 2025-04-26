const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const verifyToken = require("./verify");

// POST /ratings
router.post("/", verifyToken, async (req, res) => {
    console.log('Request body:', req.body);  
    const { userId, movieId, score, review } = req.body;
  
    if (!userId || !movieId || !score) {
      return res.status(400).json({ message: "Missing required fields." });
    }
  
    try {
      const rating = await prisma.userRating.create({
        data: {
          userId,
          movieId,
          score,
          review,
        },
      });
      res.json(rating);
    } catch (error) {
      console.error("Error creating rating:", error);
      if (error.code === "P2002") {
        res.status(400).json({ message: "You already rated this movie." });
      } else {
        res.status(500).json({ message: "Server error." });
      }
    }
  });

  module.exports = router;