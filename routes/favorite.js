const express = require('express');
const router = express.Router();
const verifyToken = require('./verify');
const prisma = require('../prisma');


// GET user favorite
router.get('/:id/favorite', async(req, res) => {
    const { id } = req.params;
    try{
        const favorite = await prisma.favorite.findMany({
            where: { userId: Number(id) },
            include: { movie: true },
        });
    
        res.json(favorite.map(fav => fav.movie));
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Server error'})
    }
})

// add item to favorite
router.post('/',verifyToken, async(req, res) => {
    const userId = Number(req.body.userId);
    const movieId = Number(req.body.movieId);
    console.log(req.user);

    if (!userId || !movieId) {
        return res.status(400).json({ error: "userId and movieId are required." });
      }
      
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
                userId: Number(userId),
                movieId: Number(movieId),
            },
    });

    res.status(201).json(addFavorite);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Server error'})
    }
});

// delete item from favorite
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
        res.json({message: `Movie ${movieId} removed from favorite.`});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Server error'})
    }
})

module.exports = router;