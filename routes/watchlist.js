const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
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
        res.status(500).send('Server error')
    }
})

// add item to watchlist
router.post('/watchlist', async(req, res) => {
    const { userId, movieId } = req.body;
    try{
        const addFavorite = await prisma.favorite.create({
            data: {
                user: { connect: { id: userId }},
                movie: { connect: { id: movieId }},
            }
        });

        res.status(201).json(addFavorite);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
})

// delete item from watchlist
router.delete('/:id/watchlist', async(req, res) => {
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
        res.status(500).send('Server error')
    }
})

module.exports = router;