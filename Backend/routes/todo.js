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

router.get('/allTodos', userAuthentication, async (req, res) => {
    const {email} = req;

    try{
        const user = await User.findOne({email: email});
        const todosList = await Todo.find({
            _id: {
                "$in": user.todosCreated
            }
        });

        return res.json({todos: todosList});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            msg: "Something is up with the server, please try again later"
        });
    }
});

module.exports = router;