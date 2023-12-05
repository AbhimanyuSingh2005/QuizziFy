const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quizId:{
        type:String,
        required:true
    }, 
    questions:[
        {
            question:{
                type:String,
                required:true
            },
            options:{
                type:Array,
                required:true
            },
            answer:{
                type:Number,
                required:true
            }
        }
    ],
    leaderboard:[
        {
            resultId:{ 
                type: String,
            },
            name: {
                type: String,
            },
            score: {    
                type: Number,
            }

        }
    ]
});

const Quiz = new mongoose.model("Quiz", quizSchema);

module.exports = Quiz;