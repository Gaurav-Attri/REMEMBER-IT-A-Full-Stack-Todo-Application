require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const userRouter = require('./routes/user');
const todoRouter = require('./routes/todo');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/todo', todoRouter);

app.listen(process.env.PORT, () => {
    console.log(`The Server is listening on PORT ${process.env.PORT}`);
});