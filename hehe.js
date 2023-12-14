const OpenAI = require('openai');
const quiz = require('../developmentAsset/quiz.js');   
const { parse } = require('path');
const openai = new OpenAI({
    apiKey: process.env.OPENAIAPIKEY // This is also the default, can be omitted
});
async function chatGPT(content,dificultyLevel ) {
    const format = {
        questions: [
            {
              question: "requested question",
              options: "array of options",
              answer: "index of correct answer in options array"
            }
          ]
    };
    const formatString = JSON.stringify(format);
    // const dificultyLevel = 10;
    const prompt = `Create a 10-question multiple-choice quiz based on the following text passage,if defficulty level of question is measured from 1-5 then target difficulty level of question is ${dificultyLevel}:\n\n${content}\n\nPlease provide the questions in JSON format with each question having the following fields: question, options, and answer. The options should be an array of four choices, and the answer should be the index of the correct answer within the options array.\n \nFormat of json object shopuld be \n\n"${formatString}"`;
    // console.log(prompt);
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content":  prompt }],
    });
    const ques = await chatCompletion.choices[0].message.content;
    const json = JSON.parse(ques);
    return(json);
    // return(quiz);
};

module.exports = chatGPT;   