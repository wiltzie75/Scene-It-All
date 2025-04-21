const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/movies/toprated', async (req, res) => {
  try {
    const topRated = await prisma.movie.findMany({
      take: 10,
      orderBy: {
        reviews: {
          _avg: {
            rating: 'desc',
          },
        },
      },
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
    const result = topRated.map((movie) => {
      const ratings = movie.reviews.map((r) => r.rating);
      const average = ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : null;
      return {
        id: movie.id,
        title: movie.title,
        averageRating: average,
        reviewCount: ratings.length,
      };
    });

    res.json(result); 
  } catch (error) {
    console.error('Error getting top rated movies:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
