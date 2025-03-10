require('dotenv').config();
const jwt = require('jsonwebtoken');

function userAuthentication(req, res, next){
    const {token} = req.headers;
    const tokenParts = token.split(" ");
    const jwtToken = tokenParts[1];
    try{
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.email = decoded.email;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            msg: "Unauthorized access is not allowed"
        });
    }
}

module.export = {
    userAuthentication
}