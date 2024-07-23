const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = "AIzaSyCMjGZC37WP_gWMG8Y30RRdAvDeDSh1xzk";
const configuration = new GoogleGenerativeAI(apiKey);
const modelName = "gemini-1.5-flash-latest";
const model = configuration.getGenerativeModel({model : modelName});

const generateNotifications = async (allActions) => {
	const allActionsText = allActions.map(action => `Action: ${JSON.stringify(action)}`).join(' ');

	try {
		const requestPayload = {
			contents: [
					{
						role: 'model',
						parts: [
							{
								text: `Based on the list of available actions and their categories, generate an interesting reminder message to keep the user engaged with the application and activities.`
							}
						]
					},
					{
						role: 'model',
						parts: [
							{
								text: `Action is the global list of all available actions such as these ${allActionsText} ` +
											`Using this data and the categories of these actions generate an intersting reminder message actions to keep the user engaged and interested.`
							}
						]
					}
				],
				systemInstruction: `Generate only one interesting, unique, quirky and fun reminder messages. 
				Return the response in JSON format with message and title as the keys. 
				title corresponds to a relevant message title, which can be fun and quirky and message corresponds to the actual message content. 
				Only return generated messages and nothing extra.`,
			};
			const response = await model.generateContent(requestPayload);
			const contentResponse = await response.response;
			const parsedResponse = parseGeminiResponse(contentResponse);
			return parsedResponse;
	} catch(error) {
		console.error('Error generating badges with LLM:', error);
		throw error;
	}
};

const parseGeminiResponse = (response) => {
	const content = response.text();
	const jsonString = content.replace('```json\n', '').replace('\n```', '');
	const notification = JSON.parse(jsonString);
	return {
		title: notification.title,
		message: notification.message
	}
};

module.exports = {
    generateNotifications
};