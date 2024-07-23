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

router.get('/award/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    if (userId) {
      const userActions = await req.prisma.userAction.findMany({
        where: {
          userId: userId,
        },
      });
      const userBadges = await req.prisma.userBadge.findMany({
        where: {
          userId: userId,
        },
      });
      const badgeResponse = await verifyBadgeQualifications(userActions, userBadges);
      const userBadge = await req.prisma.userBadge.create({
        data: {
          userId: userId,
          name: badgeResponse.name,
        },
      });
      if (userBadge && userBadge.id) {
        return res.json({
          payload: userBadge.id,
          message: 'Badge awarded',
        });
      } else {
        return res.status(422).json({
          message: 'Something went wrong',
        });
      }
    } else {
      return res.status(403).json({
        message: 'Invalid userId',
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
