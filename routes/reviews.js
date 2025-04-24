const express = require("express");
const router = express.Router();
const prisma = require('../prisma');

// get all reviews
router.get('/',async(req,res)=>{
    try{
        const reviews = await prisma.review.findMany({
            include: {
              movie: true,
              comments: true, 
            },
        });
        res.json(reviews)
    }catch(error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// get one review
router.get("/movie/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { movieId: Number(movieId) },
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// create review
router.post("/", async (req, res) => {
  const { subject, description, rating, movieId, userId } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        subject,
        description,
        rating: parseFloat(rating),
        movie: { connect: { id: Number(movieId) } },
        user: { connect: { id: Number(userId) } },
      },
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// edit review
router.put('/:id',async(req,res)=>{
  const { id } = req.params;
  const { subject, description, comments, rating } = req.body;
  try{
      const updated = await prisma.review.update({
          where: {id: Number(id)},
          data:{
              subject,
              description,
              comments: comments || undefined,
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

// create comment
router.post('/:reviewId/comments', async (req, res) => {
  const { reviewId } = req.params;
  const { subject, description, userId } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        subject,
        description,
        user: { connect: { id: Number(userId) } },
        review: { connect: { id: Number(reviewId) } },
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// edit comment
router.put('/:reviewId/comments/:commentId', async (req, res) => {
  const { reviewId, commentId } = req.params;
  const { subject, description } = req.body;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
      include: { review: true },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

  // edit review
  router.put('/:id',async(req,res)=>{
    const { id } = req.params;
    const { subject, description, comments, rating } = req.body;
    try{
        const updated = await prisma.review.update({
            where: {id: Number(id)},
            data:{
                subject,
                description,
                comments: comments || undefined,
                rating : parseFloat(rating),
            },
        });
        res.json(updated);
    }catch(error){
        console.error(error);
        res.status(500).send('Server error');
    if (comment.review.id !== Number(reviewId)) {
      return res.status(400).json({ message: 'Comment does not belong to this review' });
    }
  
  // Update the comment
  const updatedComment = await prisma.comment.update({
    where: { id: Number(commentId) },
    data: {
      subject,
      description,
    },
  });

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete comments
router.delete('/:reviewId/comments/:commentId', async (req, res) => {
  const { reviewId, commentId } = req.params;

  try {
    // First, verify that the comment belongs to the specified review
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
      include: { review: true },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.review.id !== Number(reviewId)) {
      return res.status(400).json({ message: 'Comment does not belong to this review' });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    res.json({ message: `Comment ${commentId} deleted.` });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

