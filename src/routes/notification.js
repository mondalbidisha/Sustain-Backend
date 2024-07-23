const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { generateNotifications } = require('./../generateNotifications');
const admin = require('./../firebaseAdmin');

const router = express.Router();

// Middleware to use the Prisma Client
router.use((req, res, next) => {
  req.prisma = new PrismaClient();
  next();
});

// Send notifications
router.get('/send', async (req, res) => {
  try {
    const allActions = await req.prisma.action.findMany({
      include: {
        Category: true,
      },
    });
    
    const textMessage = await generateNotifications(allActions);
		const allUsers = await req.prisma.user.findMany();
    const allUsersWithTokens = allUsers.filter(user => user.fcmToken !== null && user.fcmToken !== undefined).map(user => user.fcmToken);
		if (allUsersWithTokens.length === 0) {
			return res.send({ message: 'No FCM tokens found' });
		}
    if (textMessage.title && textMessage.message) {
			const message = {
				notification: { 
					title: textMessage.title,
					body: textMessage.message
				},
				tokens: allUsersWithTokens,
			}
			admin.messaging().sendMulticast(message)
			.then((apiResponse) => {
				res.send({ message: 'Notifications sent', apiResponse });
			})
			.catch((error) => {
				console.log(error);
				res.send({ message: 'Send notifications failure', error });
			});
    } else {
      return res.status(500).json({
        message: 'Send notifications failure',
      });
    }
  } catch (ex) {
    return res.status(500).json({
      error: 'Something went wrong',
      stackTrace: ex,
    });
  }
});

module.exports = router;
