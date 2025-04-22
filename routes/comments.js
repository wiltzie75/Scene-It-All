const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// create comments
router.post('/',async(req,res)=>{
    try{
        const { subject , description, userId, reviewId} = req.body;
        const newComment = await prisma.comment.create({
            data: {
                subject,
                description,
                userId,
                reviewId
                
            }
    });
        res.status(201).json({ message : 'Comment created successfully',comment :newComment});
    }catch(error){
        console.error('Error creating comment: ', error);
        res.status(500).json({error: ' Server Error' })
    }
});

//get comment in review
router.get('/:reviewId',async(req,res) =>{
    try{
        const{ reviewId} = req.params;
        const comments = await prisma.comment.findMany({
            where:{
                reviewId : parseInt(reviewId)
            },
            include : {
                user : true
            }
        });
        res.json(comments);
    }catch(error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: ' Server Error' })
    }
});

// delete comment
router.delete('/:commentId', async(req, res)=>{
    const { commentId } = req.params;
    try{
        const deleteComment = await prisma.comment.delete({
            where : {
                id: parseInt(commentId)
            },
        });
        res.status(200).json(deleteComment);
    }catch(error){
        console.error('Error deleting comment:', error);
        res.status(500).json({error: ' Server error' })
    }
});

// update comment
router.put('/:id',async(req,res)=>{
    const commentId = parseInt(req.params.id);
    const{ subject,description} = req.body;
    try{
        const updateComment = await prisma.comment.update({
            where : { id : commentId },
            data:{
                subject,
                description,
            },
        });
        res.json(updateComment);
    }catch(error){
        console.error('Error updating comment:', error);
        res.status(500).json({error: ' Server error' });
    }
});

module.exports = router;