const express = require('express');    //importing express
const mongoose = require('mongoose');   //importing mongoose
const chatGPT = require('./openAI');   //importing openAI.js
const router = express.Router();    //creating router
const { v4: uuidv4 } = require('uuid');  //importing uuid
const url = require('url');   //importing url

const Quiz = require('../models/questions.model');  //importing the model
const { questions } = require('../developmentAsset/quiz');
// router.use(bodyParser.urlencoded({ extended: true }));

const answer = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4];   //array to store score

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/form', (req, res) => {
    res.render('form');
});
router.get('/quizHome', (req, res) => {
    res.render('quiz_home', { quizId: req.query.id });
});
router.get('/quiz', async (req, res) => {
    // console.log(req.query.id);
    // console.log(req.query.no);
    if(req.query.no>0&&req.query.no<11){
        const quiz = await Quiz.findOne({ quizId: req.query.id });
        const ques = quiz.questions[req.query.no - 1];
        res.render('quiz_platform',
            {
                question: ques.question, 
                options: ques.options, 
                no: parseFloat(req.query.no), 
                id: req.query.id, 
                answer: answer
            });
    }else{
        res.json({message:"Invalid question number"}).status(404);
    }
});
router.get('/score', async (req, res) => { 
    const result = await Quiz.findOne({ quizId: req.query.id });
    const resultId = req.query.resultId;
    const score = result.leaderboard.find((result) => result.resultId == resultId).score;   //finding score from leaderboard
    res.render('result', { score: score });
});
router.post('/createQuiz', async (req, res) => {
    const content = req.body.quizContent;
    const difficulty = req.body.difficulty;
    const quiz = await chatGPT(content, difficulty);
    const quizId = uuidv4();
    quiz.quizId = quizId;
    const newQuiz = new Quiz(quiz);
    try {
        await newQuiz.save();
        res.redirect(url.format({
            pathname: "/quizHome",
            query: {
                "id": quizId,
            }
        })
        );
    } catch (err) {
        console.log(err);
    }
}
);
router.post('/ques', async (req, res) => {
    // console.log(req.body.quizId);

    if (req.body.answer) {
        answer[req.body.quesNo - 1] = req.body.answer;
    }
    if (req.body.quesNo == 10) {
        let score = 0;
        questions.forEach((ques, index) => {
            if (ques.answer == answer[index]) {
                score++;
            }
        });
        const resultId = uuidv4();
        const response = await Quiz.findOneAndUpdate({ quizId: req.body.quizId }, { $push: { leaderboard: {resultId:resultId, name: req.body.name, score: score } } }, { new: true });
        res.redirect(url.format({
            pathname: "/score",
            query: {
                "id": req.body.quizId,
                "resultId": resultId
            }
        })
        );
    }
    else {
        console.log(answer);
        res.redirect(url.format({
            pathname: "/quiz",
            query: {
                "id": req.body.quizId,
                "no": parseFloat(req.body.quesNo) + 1,
            }
        })
        );
    }
});
router.post('/joinQuiz',(req,res)=>{
    const quizId = req.body.quizId;
    res.redirect(url.format({
        pathname: "/quiz",
        query: {
            "id": quizId,
            "no": 1,
        }
    })
    );
});
// router.post('/getQuiz',async (req,res)=>{
//     const quizId = req.body.quizId;
//     const quiz = await Quiz.findOne({quizId:quizId});
// }); //get quiz from db

module.exports = router;    //exporting router

