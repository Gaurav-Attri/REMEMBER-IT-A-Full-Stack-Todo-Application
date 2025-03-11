const { Router } = require('express');
const { userAuthentication } = require('../middleware/user');
const { Todo, User } = require('../db');
const router = Router();

router.post('/create', userAuthentication, async (req, res) => {
    const {email} = req;
    const {title, description} = req.body;
    
    try{
        const todo = await Todo.create({
            title,
            description,
            status: false
        });

        await User.updateOne({email: email}, {
            "$push": {
                todosCreated: todo._id
            }
        });
            
        return res.status(201).json({
            msg: "Todo created successfully",
            todoId: todo._id
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            msg: "Something is up with the server, please try again later"
        })
    }
});

module.exports = router;