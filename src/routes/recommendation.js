const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { analyzeUserActions } = require('./../analyser');
const admin = require('./../firebaseAdmin');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/send', async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        UserAction: { 
          include: { action: true }
        },
      },
    });
    if (allUsers.length > 0) {
      for (const user of allUsers) {
        // we can generate recommendations only if the user logs at least 10 actions
        if (user.UserAction.length >= 10) {
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
          // get the 10 most recent userActions to make a recommendation
          const recentUserActions = user.UserAction
            .sort((a, b) => new Date(b.logDate) - new Date(a.logDate))
            .slice(0, 10);
          const recommendedActions = await analyzeUserActions(recentUserActions, allActions, allCategories);
          if (recommendedActions.title && recommendedActions.message) {
            const message = {
              notification: { 
                title: recommendedActions.title,
                body: recommendedActions.message
              },
              token: user.fcmToken,
            };
            const response = await admin.messaging().send(message);
            // eslint-disable-next-line no-console
            console.log('Successfully sent message:', response);
          } else {
            // eslint-disable-next-line no-console
            console.log('Something went wrong while generating recommendations');
            res.send({ message: 'Personalized recommendations sent to user', recommendedActions });
          }
        } else {
          // eslint-disable-next-line no-console
          console.log('Not enough actions to generate recommendations');
        }
      }
      res.send({ message: 'Personalized recommendations sent to all users' });
    } else {
      // eslint-disable-next-line no-console
      console.log('Something went wrong !! Users not found');
      res.send({ message: 'Something went wrong !! Users not found' });
    }
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error('Error generating recommendations:', ex);
    return res.status(500).json({
      message: 'Failed to generate recommendations',
      error: ex,
    });
  }
});

module.exports = router;
