const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
// get all movies
router.get ('/',async(req,res) => {
    try {
        const movies = await prisma.movie.findMany();
        res.json(movies);
    }catch (error){
        console.error(error);
        res.status(500).send('Server error');
    }
}
);
// get single movie
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const movie = await prisma.movie.findUnique({
        where: {
          id: parseInt(id)
        },
        include: {
          reviews: {
            include: {
              comments: true, // optional, include if you need comments
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          userRatings: true,
          favorites: true,
          watchlist: true
        }
      });
  
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      res.json(movie);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
// create a new movie
router.post('/',async(req, res)=> {
    const { title, plot, poster, year, genre, userRatings, reviews, userId } = req.body;
    try{
        const newMovie = await prisma.movie.create({
            data:{
                title,
                plot,
                poster,
                year,
                genre,
                userRatings,
                reviews,
                userId
            },
        });
         res.status(201).json(newMovie);
    }catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }
}
);
//update movie
router.put('/:id',async (req,res) => {
    const {id} = req.params;
    const { title, plot, poster, year, genre, userRatings, reviews } = req.body;
    try{
        const updateMovie = await prisma.movie.update({
            where : {id : id},
            data : {
                title,
                plot,
                poster,
                year,
                genre,
                userRatings,
                reviews
            },
    });
      res.json(updateMovie);
     }catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }
});
// delete movie
router.delete('/:id',async(req,res)=>{
    const{ id } = req.params;
    try{
        await prisma.review.deleteMany({
            where: {
              movieId: parseInt(id),
            },
          });
      
          // Then delete the movie
          await prisma.movie.delete({
            where: {
              id: parseInt(id),
            },
          });
        res.json({message :` Movie with ID ${id} deleted`});
    } catch(error){
        console.error(error);
        res.status(500).send('Sever error');
    }
});
module.exports = router;