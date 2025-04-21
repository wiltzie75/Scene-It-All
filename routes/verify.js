const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    
    // const token = authHeader.split(' ')[1]

    if(!token){
        console.log('❌ No token provided');
        return res.json({error: "no jwt"})
    }

    jwt.verify(token, process.env.JWT, (err, decoded) => {
        if(err) {
            console.log('❌ Invalid token');
            return res.json({error: err})
        } 

        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;