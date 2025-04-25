const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

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
        imageUrl: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const result = topRated
      .map((movie) => {
        const ratings = movie.reviews.map((r) => r.rating);
        const average = ratings.length
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
        return {
          id: movie.id,
          title: movie.title,
          imageUrl: movie.imageUrl,
          rating: parseFloat(average.toFixed(2)),
          reviewCount: ratings.length,
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

router.post("/", async (req, res) => {

  const { userId, movieId, rating } = req.body;

  // temporary hardcoded values
  // const userId = 1; // replace with actual userId from token later
  const subject = "Rated via TopRated";
  const description = "This is an auto-generated review from TopRated.jsx";

  if (!movieId || !rating || !userId) {

  const { movieId, rating } = req.body;

  // temporary hardcoded values
  const userId = 1; // replace with actual userId from token later
  const subject = "Rated via TopRated";
  const description = "This is an auto-generated review from TopRated.jsx";

  if (!movieId || !rating) {

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

    const newReview = await prisma.review.create({
      data: {
        movieId,
        userId,
        rating: parseFloat(rating),
        subject,
        description,
      },
    });

    res.status(201).json({ message: "Rating submitted", review: newReview });

  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ error: "Server error while submitting rating" });
  }
});

module.exports = router;
