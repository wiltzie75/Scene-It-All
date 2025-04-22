const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;
const verifyToken = require('./verify');

router.get('/', verifyToken, async (req, res) => {
    const { id: userId } = req.user;

    if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          reviews: {
            include: {
              movie: true
            }
          },
          comments: {
            include: {
              review: {
                include: {
                  movie: true,
                },
              },
            },
          },
          favorites: {
            include: {
              movie: true,
            },
          },
          watchlist: {
            include :{
              movie: true,
            }
          }
        },
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
// makesure the response always contains expected array fields
      const safeUser = {
        ...user,
        favorites: user.favorites ?? [],
        reviews: user.reviews ?? [],
        comments: user.comments ?? [],
        watchlist: user.watchlist ?? [] 
      };
      

      res.json(safeUser);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  module.exports = router;