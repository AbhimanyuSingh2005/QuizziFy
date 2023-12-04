const express = require('express');
const dotenv = require('dotenv');
const ejs = require('ejs');

const app = express();
dotenv.config();
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

//calling database from db
require("./db/conn");

//calling router
const indexRouter = require('./router/index');
app.use(indexRouter);



app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT} !`);
});






// app.post('/upload', async(req, res) => {
//     const response =await chatGPT(req.body.data);
//     const ques = JSON.parse(response);
//     console.log(ques);
//     res.json({ message:ques});
// });