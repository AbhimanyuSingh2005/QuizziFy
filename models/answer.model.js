const mongoose = require('mongoose');   

const answerSchema = new mongoose.Schema({
    attemptIP:{ 
        type: String,
    },
    name: {
        type: String,
    },
    score: {    
        type: Number,
    },
    // answers: [{
    //     type: Number,
    //     default: 4
    // }]
});

const Answer = mongoose.model('Answer',answerSchema);   //creating model