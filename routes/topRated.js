const express = require('express');
const router = express.Router();
const { PrismaClient } = require ('@prisma/client');
const prisma = new PrismaClient();

router.get('/',async( req, res ) => {
    const limit = parseInt(req.query.limit) || 10;
    try{  
        const topRatedMovies = await prisma.userRating.groupBy({
            by :['movieId'],
            _avg : {
                score: true,
            },
            orderBy : {
                 _avg:{
                    score : 'desc',
                 },
            },
            take: limit,
         });
         console.log('topRatedMovies', topRatedMovies);

     const movies = await Promise.all(

        topRatedMovies.map(async(item) => {

             const movie = await prisma.movie.findUnique({

                where :{ id: item.movieId },

                });

                return{

                    ...movie,
                    averageScore : item._avg.score,
                };
            })
         );
    res.status(200).json(movies);


        }catch(error){
            console.error ('Error getiing top rated movies : ',error);
            res.status(500).json({ 
                error : 'Server error ',
                message : error.message,
                stack : error.stack,
            });
        }
    
});
module.exports  = router; 