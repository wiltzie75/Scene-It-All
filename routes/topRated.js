const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const verifyToken = require("./verify");

router.get("/", async (req, res) => {
  try {
    const topRated = await prisma.movie.findMany({
      where: {
        OR: [
          { reviews: { some: { rating: { not: null } } } },
          { userRatings: { some: { score: { not: null } } } },
        ],
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        reviews: {
          select: {
            rating: true,
          },
        },
        userRatings: {
          select: {
            score: true,
          },
        },
      },
    });

    const result = topRated
      .map((movie) => {
        const reviewRatings = movie.reviews.map((r) => r.rating);
        const userRatings = movie.userRatings.map((r) => r.score);
        const allRatings = [...reviewRatings, ...userRatings];

        const average = allRatings.length
          ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
          : 0;

        return {
          id: movie.id,
          title: movie.title,
          imageUrl: movie.imageUrl,
          rating: parseFloat(average.toFixed(2)),
          reviewCount: allRatings.length,
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    res.json(result);
  } catch (error) {
    console.error("Error getting top rated movies:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /ratings
router.post("/", verifyToken, async (req, res) => {
  const { userId, movieId, score, review } = req.body;

  if (!userId || !movieId || !score) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Check if the user has already rated the movie
    const existingRating = await prisma.userRating.findUnique({
      where: {
        userId_movieId: {
          userId: parseInt(userId),
                  movieId: parseInt(movieId),
        },
      },
    });

    if (existingRating) {
      // If rating exists, update it
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
      // If no rating exists, create a new one
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

module.exports = router;
