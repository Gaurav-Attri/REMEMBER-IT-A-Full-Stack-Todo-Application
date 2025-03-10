const { Router } = require('express');
const { User } = require('../db/index');
const bcrypt = require('bcrypt');
const validateSignupInputs = require('../middleware/validateInputs');
const router = new Router();

router.post('/signup', validateSignupInputs, async (req, res) => {
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

module.exports = router;