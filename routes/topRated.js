const express = require("express");
const router = express.Router();
const prisma = require('../prisma');

router.get("/", async (req, res) => {
  try {
    const topRated = await prisma.movie.findMany({
      where: {
        reviews: {
          some: {
            rating: {
              not: null,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // average
    const result = topRated
      .map((movie) => {
        const ratings = movie.reviews.map((r) => r.rating);
        const average = ratings.length
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
        return {
          id: movie.id,
          title: movie.title,
          averageRating: parseFloat(average.toFixed(2)),
          reviewCount: ratings.length,
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 10);

    res.json(result);
  } catch (error) {
    console.error("Error getting top rated movies:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
