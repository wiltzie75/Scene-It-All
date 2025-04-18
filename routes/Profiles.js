const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//get my reviews
router.get ('/:userId/reviews',async(req,res) =>{
    const  userId = parseInt(req.params.userId);

    try{
        const myReviews = await prisma.review.findMany({
            where :{ userId },
            include :{
                movie: true,
            }      
            });
            res.json(myReviews);
    }catch(error){
        console.error(' Error fetching user reviews',error) 
        res.status(500).json({error:' Server error '});

    }
});

// get my comments

router.get('/:userId/comments', async (req, res) => {
    const  userId = parseInt(req.params.userId);
    try {
      const myComments = await prisma.comment.findMany({
        where: { userId }, 
        include: {
          review: {
            include: {
              movie: true, 
            },
          },
        },
      });
      res.json(myComments);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // edit comment
router.put('/:commentId/comments', async (req, res) => {
    const  commentId = parseInt(req.params.commentId);
    const { subject, description } = req.body;
  
    try {
      const updatedMyComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          subject,
          description,
        },
      });
      res.json(updatedMyComment);
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // delete comment
  router.delete('/:commentId/comments', async (req, res) => {
    const  commentId = parseInt(req.params.commentId);
  
    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });
      res.json({ message: `Comment ${commentId} deleted.` });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // edit review
  router.put('/:reviewId/reviews', async (req, res) => {
    const  reviewId = parseInt(req.params.reviewId);
    const { subject, description, rating } = req.body;
    try {
      const updatedMyReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          subject,
          description,
          rating: parseFloat(rating),
        },
      });
      res.json(updatedMyReview);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // delete review
  router.delete('/:reviewId/reviews', async (req, res) => {
    const  reviewId = parseInt(req.params.reviewId);
    try {
      await prisma.review.delete({
        where: { id: reviewId },
      });
      res.json({ message: `Review ${reviewId} deleted.` });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
module.exports = router;
