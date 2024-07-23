const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { analyzeUserActions } = require('./../analyser');
const admin = require('./../firebaseAdmin');

const router = express.Router();
const prisma = new PrismaClient();

// Get recommendations for a user
router.get('/send', async (req, res) => {
  try {
		const allUsers = await prisma.user.findMany();
		if(allUsers.length > 0) {
			for(const user of allUsers) {
				const userActions = await prisma.userAction.findMany({
					where: {
						userId: user.id
					},
					include: {
						action: true
					},
				});
				const allActions = await prisma.action.findMany({
					where: {
						categoryId: {
							not: null
						}
					},
					include: {
						Category: true,
					},
				});
				const allCategories = await prisma.category.findMany();
				const recommendedActions = await analyzeUserActions(userActions, allActions, allCategories);
				if (recommendedActions.title && recommendedActions.message) {
					const message = {
						notification: { 
							title: recommendedActions.title,
							body: recommendedActions.message
						},
						token: user.fcmToken,
					};
					const response = await admin.messaging().send(message);
					console.log('Successfully sent message:', response);
				} else {
					console.log("Something went wrong while generating recommendations");
					res.send({ message: 'Personalized recommendations sent to user', recommendedActions });
				}
			}
			res.send({ message: 'Personalized recommendations sent to all users' });
		} else {
			console.log("Something went wrong !! Users not found");
			res.send({ message: 'Something went wrong !! Users not found' });
		}
  } catch (ex) {
    console.error('Error generating recommendations:', ex);
    return res.status(500).json({
      message: 'Failed to generate recommendations',
      error: ex,
    });
  }
});

module.exports = router;
