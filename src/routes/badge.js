const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyBadgeQualifications } = require('./../badgeService');

const router = express.Router();

router.use((req, res, next) => {
  req.prisma = new PrismaClient();
  next();
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    if (userId) {
      const userBadges = await req.prisma.userBadge.findMany({
        where: {
          id: userId,
        },
      });
      if (userBadges.length === 0) {
        return res.json({
          badges: [],
          message: 'No Badges found',
        });
      } else {
        return res.json({
          badges: userBadges,
          message: 'All User Badges',
        });
      }
    } else {
      return res.status(403).json({
        message: 'Invalid userId',
      });
    }
  } catch (ex) {
    return res.status(422).json({
      error: 'Something went wrong',
      stackTrace: ex,
    });
  }
});

router.get('/award', async (req, res) => {
  try {
    const allUsers = await req.prisma.user.findMany({
      include: {
        UserAction: { 
          include: { action: true }
        },
      },
    });
    if (allUsers.length > 0) {
      for (const user of allUsers) {
        const userBadges = await req.prisma.userBadge.findMany({
          where: {
            userId: user.id,
          },
        });
        const badgeResponse = await verifyBadgeQualifications(user.UserAction, userBadges);
        const userBadge = await req.prisma.userBadge.create({
          data: {
            userId: user.id,
            name: badgeResponse.name,
          },
        });
        if (userBadge && userBadge.id) {
          // eslint-disable-next-line no-console
          console.log(`Badge awarded to ${user.id}`);
        } else {
          return res.status(422).json({
            message: 'Something went wrong',
          });
        }
      }
      return res.json({
        message: 'Badge awarded to all users successfully',
      });
    } else {
      return res.status(404).json({
        message: 'No Users found',
      });
    }
  } catch (ex) {
    return res.status(422).json({
      message: 'Failed to award badges',
      error: ex,
    });
  }
});

module.exports = router;
