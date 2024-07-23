const { GoogleGenerativeAI } = require('@google/generative-ai');
const { badgeRules } = require('./badgeRules');
  
const apiKey = process.env.GEMINI_API_KEY;
const configuration = new GoogleGenerativeAI(apiKey);
const modelName = "gemini-1.5-flash-latest";
const model = configuration.getGenerativeModel({model : modelName});

const verifyBadgeQualifications = async (allUserActions, userBadges) => {
	const allActionsText = allUserActions.map(action => `UserAction: ${JSON.stringify(action)}`).join(' ');
	const allBadgeRulesText = badgeRules.map(rule => `BadgeRule: ${JSON.stringify(rule)}`).join(' ');
	const allUserBadges = userBadges.map(badge => `UserBadge: ${JSON.stringify(badge)}`).join(' ');

	try {
		const requestPayload = {
		contents: [
				{
					role: 'model',
					parts: [
						{
							text: 'You are a system that awards badges based on user actions logged by a particular user.' +
										`BadgeRule description specifies on what basis a badge is to be awarded.` +
										`Each Rule has an actions array that defines the names of the actions that need to logged and the count parameter against each parameter defines how many times that particular action should be logged.` +
										`You are supposed to use the action names specified in BadgeRules and the action names of all UserActions to make a decision` +
										`Strictly follow the BadgeRule description and count inside actions array to decide whether a badge should be awarded or not.`
						}
					]
				},
				{
					role: 'model',
					parts: [
						{
							text: `UserActions is the list of all actions logged by a particular user such as these ${allActionsText}.` +
										`BadgeRules is the list of rules based on which badges are awarded to users such as ${allBadgeRulesText}` +
										`BadgeRules define which actions need to be logged and how many times they need to be logged in order to receive a particular badge` +
										`UserBadges is the list of badges that a user has already received such as ${allUserBadges}. Make sure no badge is awarded twide.` +
										`Using this data generate appropriate badges that should be awarded to a user. If no badges can be awarded, then return empty array [].`
						}
					]
				}
			],
			systemInstruction: 'Recommend one badge that can be awarded to a user by analysing their UserAction, UserBadge and BadgeRule. Follow instructions strictly and do not make anything up. Return the response in JSON format with the only the badge name, with "name" being the key, there should be no duplicates. Only return generated response and nothing extra.',
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
	const badge = JSON.parse(jsonString);
	return badge;
};

module.exports = {
	verifyBadgeQualifications
};