require("dotenv").config();
const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db/index');
const {validateSignupInputs, validateSigninInputs} = require('../middleware/validateInputs');
const {validateUniqueEmail} = require('../middleware/user');
const router = new Router();

router.post('/signup', validateSignupInputs, validateUniqueEmail, async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    if(!user){
        return res.json(500).json({
            msg: "Intenal Server error"
        });
    }
    else{
        return res.json({
            msg: "User Created Successfully"
        });
    }
});

router.post('/signin', validateSigninInputs, async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(401).json({
            msg: "Invalid Credentials"
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
        return res.status(401).json({
            msg: "Invalid Password"
        });
    }

    const token = jwt.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        email}, process.env.JWT_SECRET);
    return res.json({token});
})
module.exports = router;