require('dotenv').config();
const {User} = require('../db/index');
const jwt = require('jsonwebtoken');

function userAuthentication(req, res, next){
    const {authorization} = req.headers;
    const tokenParts = authorization.split(" ");
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

async function validateUniqueEmail(req, res, next){
    try{
        const {email} = req.body;
        const user = await User.findOne({email: email});
        if(user){
            return res.status(409).json({
                msg: "Email already in use"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            msg: "Internal Server error, please try again later"
        });
    }

}

module.exports = {
    userAuthentication,
    validateUniqueEmail
}