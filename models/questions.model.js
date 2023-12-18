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
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ]
});

const Quiz = new mongoose.model("Quiz", quizSchema);

module.exports = Quiz;