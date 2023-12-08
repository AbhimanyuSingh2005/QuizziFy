const express = require('express');    //importing express
const mongoose = require('mongoose');   //importing mongoose
const chatGPT = require('./openAI');   //importing openAI.js
const router = express.Router();    //creating router
const { v4: uuidv4 } = require('uuid');  //importing uuid
const url = require('url');   //importing url

const Quiz = require('../models/questions.model');  //importing the model
const { questions } = require('../developmentAsset/quiz');
// router.use(bodyParser.urlencoded({ extended: true }));

let answer = [];   //array to store score

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/form', (req, res) => {
    res.render('form');
});
router.get('/quizHome', (req, res) => {
    res.render('quiz_home', { id: req.query.id });
});
router.get('/quiz', async (req, res) => {
    // console.log(req.query.id);
    // console.log(req.query.no);
    if(req.query.no>0&&req.query.no<11){
        const quiz = await Quiz.findOne({ quizId: req.query.id });
        const ques = quiz.questions[req.query.no - 1];
        // const resultId = req.query.r;
        // const answer = quiz.leaderboard.find((result) => result.resultId == resultId).answer;   //finding answer from leaderboard
        res.render('quiz_platform',
            {
                question: ques.question, 
                options: ques.options, 
                no: parseFloat(req.query.no), 
                id: req.query.id, 
                answer: answer,
                // resultId:resultId
            }
        );
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
        // answer =  [5,5,5,5,5,5,5,5,5,5]; 
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
    const quiz = await Quiz.findOne({ quizId: req.query.id });
    const questions = quiz.questions;
    // const resultId = req.query.r;
    // const answer = quiz.leaderboard.find((result) => result.resultId == resultId).answer;   //finding answer from leaderboard
    if (req.body.answer) {
        answer[req.query.no - 1] = req.body.answer;
        // const response = await Quiz.findOneAndUpdate({ quizId: req.body.quizId }, {leaderboard.find((result) => result.resultId == resultId).answer: answer });
    }
    if (req.query.no == 10) {
        
        let score = 0;
        questions.forEach((ques, index) => {
            if (ques.answer == answer[index]) {
                score++;
            }
        });
        const resultId = uuidv4();
        const name = req.body.name;
        try{
            const response = await Quiz.updateOne({ quizId: req.query.id }, { $push: { leaderboard: {resultId:resultId,name:name,score:score} } });
        }catch(err){
            console.log(err);
        }
        res.redirect(url.format({
            pathname: "/score",
            query: {
                "id": req.query.id,
                "resultId": resultId
            }
        })
        );
    }
    else {
        // console.log(answer);1111111111111
        res.redirect(url.format({
            pathname: "/quiz",
            query: {
                "id": req.query.id,
                "no": parseFloat(req.query.no) + 1,
            }
        })
        );
    }
});
router.post('/joinQuiz',async(req,res)=>{
    const quizId = req.body.quizId;
    answer = [4,4,4,4,4,4,4,4,4,4];
    // const resultId = uuidv4();
    // const response = await Quiz.findOneAndUpdate({ quizId: req.body.quizId }, { $push: { leaderboard: {resultId:resultId} } });    
    res.redirect(url.format({
        pathname: "/quiz",
        query: {
            "id": quizId,
            // "r": resultId,
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

