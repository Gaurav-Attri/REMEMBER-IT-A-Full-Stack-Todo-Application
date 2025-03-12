const { Router } = require('express');
const { userAuthentication } = require('../middleware/user');
const { Todo, User } = require('../db');
const mongoose = require('mongoose');
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
        console.error(err);
        return res.status(500).json({
            msg: "Something is up with the server, please try again later"
        });
    }
});

router.put('/update', userAuthentication, async (req, res) => {
    const {title, description, status} = req.body;
    const todoId = new mongoose.Types.ObjectId(String(req.body.todoId));
    const {email} = req;

    try{
        const user = await User.findOne({email: email});
        const todosCreated = user.todosCreated;

        if(todosCreated.includes(todoId)){
            await Todo.updateOne({_id: todoId}, {
                title: title,
                description: description,
                status: status
            });
            return res.status(200).json({
                msg: "Todo updated successfully",
                todoId
            });
        }

        return res.status(401).json({
            msg: "You can't update somebody else's todo"
        });
        
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            msg: "Something is up with the server, please try again later"
        });
    }


});

module.exports = router;