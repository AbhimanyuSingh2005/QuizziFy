const express = require('express');    //importing express
const mongoose = require('mongoose');   //importing mongoose
const run = require('./gemini');   //importing openAI.js
const router = express.Router();    //creating router
const { v4: uuidv4 } = require('uuid');  //importing uuid
const url = require('url');   //importing url
const multer = require('multer');   //importing multer

const Quiz = require('../models/questions.model');  //importing the model
const Result = require('../models/results.model');  //importing the model
let answer = [];   //array to store score


//////////////////////////////////////////////// Home Route /////////////////////////////////////////////////

router.get('/', (req, res) => {
    res.render('index');
});

//////////////////////////////////////////////// Get Route to Create quiz from Pdf /////////////////////////////////////////////////
router.get('/pdfToQuiz', (req, res) => {
    res.render('pdfToQuiz');
});

//////////////////////////////////////////////// Get Route to Create quiz from Prompt /////////////////////////////////////////////////

router.get('/promptToQuiz', (req, res) => {
    res.render('promptToQuiz');
});

//////////////////////////////////////////////// Get Route to Quiz Home Page after creation of Quiz /////////////////////////////////////////////////
router.get('/quizHome', (req, res) => {
    res.render('quiz_home', { id: req.query.id });
});

//////////////////////////////////////////////// Get Route to Quiz Platform /////////////////////////////////////////////////
router.get('/quiz', async (req, res) => {
    if(req.query.no>0&&req.query.no<11){
        const quiz = await Quiz.findOne({ quizId: req.query.id });
        const ques = quiz.questions[req.query.no - 1];
        res.render('quiz_platform',
            {
                question: ques.question, 
                options: ques.options, 
                no: parseFloat(req.query.no), 
                id: req.query.id, 
                answer: answer,

            }
        );
    }else{
        res.json({message:"Invalid question number"}).status(404);
    }
});

//////////////////////////////////////////////// Get Route to Score /////////////////////////////////////////////////
router.get('/score', async (req, res) => { 
    const result = await Result.findOne({ resultID: req.query.r });
    const score = result.score;
    const results =  await Result.find({ quizId: req.query.id });
    results.sort((a,b)=>b.score-a.score);
    const leaderboard = results.slice(0,10);
    res.render('result', { score: score ,leaderboard:leaderboard, id: req.query.id, r: req.query.r});
});

//////////////////////////////////////////////// Get Route to Review Your Answer /////////////////////////////////////////////////

router.get('/review', async (req, res) => {
    const result = await Result.findOne({ resultID: req.query.r });
    const quiz = await Quiz.findOne({ quizId: req.query.id }); 
    const answers = result.answer;
    res.render('review', { id: req.query.id, r: req.query.r, questions: quiz.questions, answers: answers,no:parseFloat(req.query.no)});
});
//////////////////////////////////////////////// Post Route to create Quiz form Pdf/////////////////////////////////////////////////
router.post('/createQuiz', async (req, res) => {
    const content = req.body.quizContent;
    const difficulty = req.body.difficulty;
    const promptType = req.body.promptType;
    // console.log(req.body);
    const quiz = await run(content, difficulty,promptType);
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


//////////////////////////////////////////////// Post Route to Answer And Submit quiz /////////////////////////////////////////////////
router.post('/ques', async (req, res) => {
    // console.log(req.body.quizId);
    const quiz = await Quiz.findOne({ quizId: req.query.id });
    const questions = quiz.questions;
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
        // const name = req.body.name;
        const result = new Result({
            quizId: req.query.id,
            resultID: resultId,
            name: req.body.name,
            score: score,
            answer: answer
        });
        // console.log(result);
        try{
            const response = await result.save();
            // console.log(response);
        }catch(err){
            
            console.log(err);
        }
        res.redirect(url.format({
            pathname: "/score",
            query: {
                "id": req.query.id,
                "r": resultId
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


//////////////////////////////////////////////// Post Route to Join quiz /////////////////////////////////////////////////

router.post('/joinQuiz',async(req,res)=>{
    const quizId = req.body.quizId;
    answer = [4,4,4,4,4,4,4,4,4,4];
    res.redirect(url.format({
        pathname: "/quiz",
        query: {
            "id": quizId,
            "no": 1,
        }
    })
    );
});



///////////////////////////////////////////////// PDF to text /////////////////////////////////////////////////
// const upload = multer({ dest: './uploads/' });
// router.get('/convert', (req, res) => {
//     res.render('newopai');
// });
// const convertToText = require('./convertapi');
// router.post('/convert', upload.single('file'),(req, res) => {
//     if (!req.files || !req.files.file) {
//         return res.status(400).send('No file uploaded');
//     }
//     const file = req.files.file;
//     const fileName = file.name;
//     console.log(file);
//     console.log(fileName);
//     res.send('File Uploaded');
// });


module.exports = router;    //exporting router

