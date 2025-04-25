const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('./verify');
const prisma = new PrismaClient();

// GET user watchlist
router.get('/:id/watchlist', async(req, res) => {
    const { id } = req.params;
    try{
        const watchlist = await prisma.favorite.findMany({
            where: { userId: Number(id) },
            include: { movie: true },
        });
    
        res.json(watchlist.map(fav => fav.movie));
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Server error'})
    }
})

// add item to watchlist
router.post('/',verifyToken, async(req, res) => {
    const { userId, movieId } = req.body;
    console.log(req.user);
    try{
    
        const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} not found.` });
    }


    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      return res.status(404).json({ error: `Movie with ID ${movieId} not found.` });
    }

    const addFavorite = await prisma.favorite.create({
        data: {
            userId,
            movieId,
        },
    });

    res.status(201).json(addFavorite);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Server error'})
    }
});

// delete item from watchlist
router.delete('/:userId/:movieId', async(req, res) => {
    const { userId, movieId } = req.params;
    try{
        await prisma.favorite.delete({
            where: { 
                userId_movieId: {
                    userId: Number(userId),
                    movieId: Number(movieId),
                }
            }
        });
        res.json({message: `Movie ${movieId} removed from watchlist.`});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Server error'})
    }
})

module.exports = router;