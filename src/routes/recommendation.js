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
        if (user.UserAction.length >= 5) {
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
          const recommendedActions = await analyzeUserActions(user.UserAction, allActions, allCategories);
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
