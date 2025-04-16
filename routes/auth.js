const express = require('expess');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require ('bcrypt');
const jwt = require(' jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = "secret_key_123";





router.post('/register',async(req,res) => {
    const{ firstName , lastName, email, password} = req.body;
    try{
        const existingUser = await prisma.user.findUnique({
            where : {email},
        });
        if (existingUser){
            return res.status(400).json({ error:'Email already registerd'});
        }
        const hashedPassword = await bcrypt.hash(password,10 );
        const newUser = await prisma.user.create({
            data:{
                firstName,
                lastName,
                email,
                password : hashedPassword,
            },
        });
        res.status(201).json({message :'User registered successfully',user: newUser});
    } catch(error){
        console.error('Registration error',error);
        res.status(500).json({ error :'Server error'});
    }
});

router.post('/login',async(req,res)=>{
    const { email, password} = req.body;
    try{
        const user = await prisma.user.findUnique({
            where: { email},
        });
        if(!user) {
            return res.status(401).json({ error :'Invalid email or password '});

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ error : 'Invalid email or password '}); 
        }
        const token = jwt.sign({ userId : user.id , isAdmin : user.isAdmin}, JWT_SECRET, {expiresIn : '1h'});

        res.json({
            message: `Welcome back, ${user.firstName}! `,
            token,
        });
    } catch(error){
        console.error('Login error',error);
        res.status(500).json({error: ' Server error'});
    }
    
});