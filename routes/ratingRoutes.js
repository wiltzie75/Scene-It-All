const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.post("/", async (req, res) => {
  const { movieId, rating } = req.body;

  if (!movieId || !rating) {
    return res
      .status(400)
      .json({ message: "Movie ID and rating are required" });
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: Number(movieId) },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Calculate new rating (basic logic: average with previous)
    const newRating = (movie.userRatings + rating) / 2;

    const updatedMovie = await prisma.movie.update({
      where: { id: Number(movieId) },
      data: { userRatings: newRating },
    });

    res.json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
