const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;
const verifyToken = require('./verify');

router.get('/', verifyToken, async (req, res) => {
    console.log('🔍 Decoded user from token:', req.user);
    const { id: userId } = req.user;

    if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          reviews: true,
          comments: true,
          favorites: {
            include: {
              movie: true,
            },
          },
        },
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  module.exports = router;