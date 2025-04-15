const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// get all movies

router.get ('/api/movie',async(req,res) => {
    try {
        const movies = await prisma.movie.findMany();
        res.json(movies);
    }catch (error){
        console.error(error);
        res.status(500).send('Server error');
    }
}
);
// get sigle movie
router.get('/:id',async(req, res) => {
    const {id} = req.params;
    try{
        const movie= await prisma.movie.findUnique({
            where:{id: Number(id)},
        })
        if(!movie){
            return res.status(404).json({message: 'Movie not found'});
        } res.json(movie);

    } catch (error){
        console.error(error);
        res.status(500).send ('Server error');
    }

});

// create a new movie
router.post('/',async(req, res)=> {
    const { title, description, image, year, genre, rating, review } = req.body;
    try{
        const newMovie = await prisma.movie.create({
            data:{
                title,
                description,
                image, 
                year, 
                genre, 
                rating, 
                review
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
    const { title, description, image, year, genre, rating, review } = req.body;
    try{ 
        const updateMovie = await prisma.movie.update({
            where : {id : Number(id)},
            data : {
                title, 
                description, 
                image, 
                year, 
                genre, 
                rating, 
                review,

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
        await prisma.movie.delete({
            where:{ id : Number(id)},
        });
        res.json({message :` Movie with ID ${id} deleted`});
    } catch(error){
        console.error(error);
        res.status(500).send('Sever error');
    }
});

module.exports = router;