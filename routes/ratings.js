const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const verifyToken = require("./verify");

// GET /ratings
router.get("/", verifyToken, async (req, res) => {
    const { userId, movieId } = req.query;

    if (!userId || !movieId) {
        return res.status(400).json({ message: "Missing userId or movieId" });
    }

    try {
        // Fetch the rating for the given userId and movieId
        const rating = await prisma.userRating.findUnique({
            where: {
                userId_movieId: {
                    userId: parseInt(userId),
                    movieId: parseInt(movieId),
                },
            },
        });

        if (rating) {
            return res.json(rating);
        } else {
            return res.status(404).json({ message: "Rating not found." });
        }
    } catch (error) {
        console.error("Error fetching rating:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// GET /ratings/user/:userId
router.get("/user/:userId", verifyToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const userRatings = await prisma.userRating.findMany({
            where: {
                userId: parseInt(userId),
            },
        });

        res.json(userRatings);
    } catch (error) {
        console.error("Error fetching user ratings:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// POST /ratings
router.post("/", verifyToken, async (req, res) => {
    const { userId, movieId, score, review } = req.body;
  
    if (!userId || !movieId || !score) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      const existingRating = await prisma.userRating.findUnique({
        where: {
          userId_movieId: {
            userId: parseInt(userId),
                    movieId: parseInt(movieId),
          },
        },
      });

      if (existingRating) {
        const updatedRating = await prisma.userRating.update({
          where: {
            userId_movieId: {
                userId: parseInt(userId),
                movieId: parseInt(movieId),
            },
          },
          data: {
            score,
            review,
          },
        });
        return res.json({ message: "Rating updated", updatedRating });
      } else {
        const newRating = await prisma.userRating.create({
          data: {
            userId: parseInt(userId),
                    movieId: parseInt(movieId),
            score,
            review,
          },
        });
        return res.json({ message: "New rating created", newRating });
      }
    } catch (error) {
      console.error("Error handling rating:", error);
      res.status(500).json({ message: "Server error." });
    }
});

// PUT /ratings/:movieId
router.put("/:movieId", verifyToken, async (req, res) => {
    const { movieId } = req.params;
    const { userId, score, review } = req.body;
  
    if (!userId || !score) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      const existingRating = await prisma.userRating.findFirst({
        where: {
            userId: parseInt(userId),
            movieId: parseInt(movieId),
        },
      });

      if (existingRating) {
        const updatedRating = await prisma.userRating.update({
          where: { id: existingRating.id },
          data: {
            score,
            review,
          },
        });
        return res.json(updatedRating);
      } else {
        return res.status(400).json({ message: "Rating not found for this movie." });
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      res.status(500).json({ message: "Server error." });
    }
  });

  module.exports = router;