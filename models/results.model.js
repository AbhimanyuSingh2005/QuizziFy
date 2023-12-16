const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    quizId:{
        type:String,
        required:true
    },
    resultID: {
        type: String,
        required: true,
        // unique: true
    },
    name: {
        type: String,
    },
    score: {
        type: Number,
    },
    answer: [
        {
            type: Number,
        }
    ]
});

const Result = new mongoose.model("Result", resultSchema);

module.exports = Result;