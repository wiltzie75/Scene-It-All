const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// get all reviews
router.get('/',async(req,res)=>{
    try{
        const reviews = await prisma.review.findMany({
            include: {movie: true},
        });
        res.json(reviews)
    }catch(error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// get one review
router.get('/movie/:movieId', async (req, res) => {
    const { movieId } = req.params;
    try {
      const reviews = await prisma.review.findMany({
        where: { movieId: Number(movieId) },
      });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  // create review 
  router.post('/',async(req,res) => {
    const { content, rating,movieId } = req.body;
    try{
        const review = await prisma.review.create({
            data:{
                content,
                rating : parseFloat(rating),
                movie : { connect : { id : Number(movieId)}} 
            },
        });
        res.status(201).json(review);
    }catch(error){
        console.error(error);
        res.status(500).send('Server error')
    }
  });

  // edit review
  router.put('/:id',async(req,res)=>{
    const { id } = req.params;
    const { content, rating } = req.body;
    try{
        const updated = await prisma.review.update({
            where: {id: Number(id)},
            data:{
                content,
                rating : parseFloat(rating),
            },
        });
        res.json(updated);

    }catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }
  });

  // delete review
  router.delete('/:id',async(req,res) => {
    const { id } = req.params;
    try{
        await prisma.review.delete({
            where : { id: Number(id)},

        });
        res.json({message : `Review ${id} deleted.`});
    } catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }
  });
  module.exports = router;