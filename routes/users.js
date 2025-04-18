const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;
// get all users
router.get('/', async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          reviews: true,
          comments: true,
        },
      });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  // GET single user by id
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          reviews: true,
          comments: true,
        },
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  // login user
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: 
          {email} });
        if(!user) return res.json({error: "no user found"})
        
          const passwordCheck = await bcrypt.compare(password, user.password)
          if(!passwordCheck) return res.json({error: "incorrect password :("})

            const token = jwt.sign({ id: user.id }, process.env.JWT);
            res.json({token});
      } catch (error) {
        next(error);
      }
    })


  // create user (register)
  router.post('/', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword, 
        },
      });
      res.status(201).json(user);
    } catch (error) {
      console.error("❌ Error creating user:", error.message);
      res.status(500).send('Server error');
    }
  });
  //  update user
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, password, isAdmin } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          firstName,
          lastName,
          email,
          password,
          isAdmin
        },
      });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = Number(id);
  
    try {
      const userMovies = await prisma.movie.findMany({
        where: { userId },
        select: { id: true }
      });
      const userMovieIds = userMovies.map(movie => movie.id);
  
      await prisma.review.deleteMany({
        where: { movieId: { in: userMovieIds } }
      });
  
      await prisma.comment.deleteMany({ where: { userId } });
      await prisma.review.deleteMany({ where: { userId } });
      await prisma.userRating.deleteMany({ where: { userId } });
      await prisma.favorite.deleteMany({ where: { userId } });
      await prisma.movie.deleteMany({ where: { userId } });
  
      const deletedUser = await prisma.user.delete({
        where: { id: userId }
      });
  
      res.json({ message: `User ${id} deleted`, user: deletedUser });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  module.exports = router;










