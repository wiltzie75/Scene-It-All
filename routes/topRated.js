const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

router.post("/", async (req, res) => {
  const { userId, movieId, rating } = req.body;

  // temporary hardcoded values
  // const userId = 1; // replace with actual userId from token later
  const subject = "Rated via TopRated";
  const description = "This is an auto-generated review from TopRated.jsx";

  if (!movieId || !rating || !userId) {
    return res.status(400).json({ error: "Missing movieId or rating" });
  }

  try {
    const newRating = await prisma.userRating.create({
      data: {
        user: userId,
        movie: movieId,
        score: rating,
        movie: {
          connect: { id: movieId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
    console.log();

    res.status(201).json({ message: "Rating submitted", score: newRating });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ error: "Server error while submitting rating" });
  }
});

module.exports = router;
