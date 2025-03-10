require("dotenv").config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    todosCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }]
});

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    Status: Boolean,
});

const User =  mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
    User,
    Todo
}