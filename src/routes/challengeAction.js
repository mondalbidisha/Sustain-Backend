const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();

const prisma = new PrismaClient();

const createChallengeActionInput = z.object({
  name: z.string(),
  impact: z.number(),
  userId: z.string().uuid(),
  actionId: z.string().uuid(),
  challengeId: z.string().uuid(),
  description: z.string(),
  image: z.string().optional(),
});

router.post('/log-challenge-action', async (req, res) => {
  const body = req.body;
  const { success, error } = createChallengeActionInput.safeParse(body);
  if (!success) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(400).json({
      message: 'Invalid Inputs',
      error: error.errors,
    });
  }
  try {
    const challengeAction = await prisma.challengeAction.findFirst({
      where: {
        actionId: body.actionId,
        challengeId: body.challengeId,
      },
    });
    if (!challengeAction) {
      return res.status(400).json({ error: 'Action not part of the challenge.' });
    }
    const userAction = await prisma.userAction.create({
      data: {
        name: body.name,
        impact: body.impact,
        userId: body.userId,
        actionId: body.actionId,
        description: body.description,
        image: body.image,
      },
    });
    if (userAction) {
      const user = await prisma.user.findUnique({
        where: { id: body.userId },
      });
      const action = await prisma.action.findUnique({
        where: { id: body.actionId },
      });
      if (user && action) {
        await prisma.user.update({
          where: { id: body.userId },
          data: {
            totalUserActions: user.totalUserActions + 1,
            totalActionPoints: user.totalActionPoints + action.actionPoints,
            totalImpactPoints: user.totalImpactPoints + action.impactPoints,
            totalCo2Saved: user.totalCo2Saved + action.co2Saved,
            totalWaterSaved: user.totalWaterSaved + action.waterSaved,
            totalWasteSaved: user.totalWasteSaved + action.wasteSaved,
          },
        });
        const challengeActions = await prisma.challengeAction.findMany({
          where: { challengeId: body.challengeId },
        });
        const userActions = await prisma.userAction.findMany({
          where: { userId: body.userId },
        });
        const loggedActionIds = new Set(userActions.map((ua) => ua.actionId));
        const requiredActionIds = new Set(challengeActions.map((ca) => ca.actionId));
        const isCompleted = [...requiredActionIds].every(id => loggedActionIds.has(id));
        if (isCompleted) {
          await prisma.userChallenge.deleteMany({
            where: { userId: body.userId, challengeId: body.challengeId },
          });
        }
        return res.json({
          id: userAction.id,
          message: 'User action logged successfully',
          challengeCompleted: isCompleted ? 'Challenge completed successfully' : 'Challenge not yet completed',
        });
      }
    } else {
      return res.status(500).json({ error: 'Failed to log challenge action' });
    }
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error('Error logging challenge action:', ex);
    return res.status(500).json({ error: 'Something went wrong', stackTrace: ex });
  }
});

module.exports = router;

