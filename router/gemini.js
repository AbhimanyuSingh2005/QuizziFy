// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-pro";
  const API_KEY = process.env.GEMINIAPIKEY;
  
  async function run(content, difficultyLevel,promptType ) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    if(promptType == 1){
      const parts = [
        {text: `Create a 10-question multiple-choice quiz based on  following topic, if difficulty level of question is measured from 1-3 where \ndifficulty 1 means easy. Questions should be straightforward and Its answer should be one word.\ndifficulty 2 means moderate and should be tougher than previous difficulty and less than next difficulty. It should be mix of both difficulty.\ndifficulty 3 means harder and questions should not be straightforward and option can be of a sentence.\n\nthen target difficulty level of question is  ${difficultyLevel}.\n\nTopic of quiz is given below:\n\n\ ${content}\n\n\n\nQuestion Should Strictly be based on Above Topic.\nPlease provide the questions in JSON format with each question having the following fields: question, options, answer and explanation to why answer is correct. The options should be an array of four choices, and the answer should be the index of the correct answer within the options array.\nUse single inverted comma to highlight any part in questions and option. So, it does not interfere with  JSON format.\nFormat of JSON object should be :   \nquestions: [\n            {\n              question: \\\"requested question\\\",\n              options: \\\"array of options\\\",\n              answer: \\\"index of correct answer in options array\\\"\n\t\t\t  explanation:\\\"explain the reason why answer is correct\\\"\n           }\n          ]\n    };\n`}
      ];
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });
    
      const response = result.response;
      let responseText = response.text().replace(/```/g, '');
      responseText = responseText.replace(/json/g, '');
      console.log(responseText);
      const JSONResponse = JSON.parse(responseText); 
      return(JSONResponse);
    }else{
      const parts = [
        {text: `Create a 10-question multiple-choice quiz based on the following text passage, if difficulty level of question is measured from 1-3 where \ndifficulty 1 means easy. Questions should be straightforward and Its answer should be one word.\ndifficulty 2 means moderate and should be tougher than previous difficulty and less than next difficulty. It should be mix of both difficulty.\ndifficulty 3 means harder and questions should not be straightforward and option can be of a sentence. Model can add question from its own knowledge related to topic in content.\n\nthen target difficulty level of question is  ${difficultyLevel}.\n\nContent of quiz is:\n\n${content}\n\nPlease provide the questions in JSON format with each question having the following fields: question, options, answer and explanation to why answer is correct. The options should be an array of four choices, and the answer should be the index of the correct answer within the options array.\nUse single inverted comma to highlight any part in questions and option. So, it does not interfere with  JSON format.\nFormat of JSON object should be :   \nquestions: [\n            {\n              question: \\\"requested question\\\",\n              options: \\\"array of options\\\",\n              answer: \\\"index of correct answer in options array\\\"\n\t\t\t  explanation:\\\"explain the reason why answer is correct\\\"\n           }\n          ]\n    };\n`}
      ];
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });
    
      const response = result.response;
      let responseText = response.text().replace(/```/g, '');
      responseText = responseText.replace(/json/g, '');
      console.log(responseText);
      const JSONResponse = JSON.parse(responseText); 
      return(JSONResponse);
    }
  }
  
module.exports = run;