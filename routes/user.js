const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
  // create user (register)
  router.post('/', async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  //  update user
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { email, password, name, role } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          email,
          password,
          name,
          role,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  // remove user
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({
        where: { id: Number(id) },
      });
      res.json({ message: `User ${id} deleted.` });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  module.exports = router;










