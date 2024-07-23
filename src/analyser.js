const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const configuration = new GoogleGenerativeAI(apiKey);
const modelName = "gemini-1.5-flash-latest";
const model = configuration.getGenerativeModel({model : modelName});

const analyzeUserActions = async (userActions, allActions, allCategories) => {
    try {
    const requestPayload = {
        contents: [
            {
              role: 'model',
              parts: [
                {
                  text: 'Based on the following user actions and their categories, recommend one similar action that the user might be interested in. Donot recommend an action that has already logged by user - can be found in UserActions data.'
                }
              ]
            },
            {
              role: 'model',
              parts: [
                {
                  text: "userActions are actions already logged by the user such as these " + 
                        userActions.map(action => `UserAction: ${JSON.stringify(action.name)}`).join(' ') 
                        + ' ' + "Action is the global list of all available actions. Using this data and the categories of each of these actions to recommend similar category actions that the user might be interested in." 
                        + allActions.map(action => `ActionName: ${JSON.stringify(action.name)}, ActionDescription: ${JSON.stringify(action.description)}`).join(' ')
                        + "ActionCategory is the category that an action belongs to. Use this to analyse the action logging pattern for a particular user and recommend similar actions that they may be interested in"
                        + ' ' +  allCategories.map(category => `ActionCategory: ${JSON.stringify(category.name)}`).join(' ') 
                }
              ]
            }
        ],
        systemInstruction: 'Recommended only one action by analysing UserAction, Action and ActionCategory. Your action recommendation should be phrased in an interesting, unique, quirky and fun manner. Return the response in valid JSON format with message and title as the keys. title corresponds to a relevant recommendation title, which can be fun and quirky and message corresponds to the actual recommendation content. Only return recommendations in the given format and nothing else.',
      };
  
      // Send the prompt to the Gemini model
      const response = await model.generateContent(requestPayload);
      const contentResponse = await response.response;
      const parsedResponse = parseGeminiResponse(contentResponse);
      return parsedResponse;
    } catch (error) {
      console.error('Error analyzing user actions with LLM:', error);
      throw error;
    }
};

const parseGeminiResponse = (response) => {
    const content = response.text();
    const jsonString = content.replace('```json\n', '').replace('\n```', '');
    const recommendation = JSON.parse(jsonString);
    return {
      title: recommendation.title,
      message: recommendation.message
    }
};

module.exports = {
    analyzeUserActions
};