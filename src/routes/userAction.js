const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const router = express.Router();

// Middleware to use the extended Prisma Client with Accelerate
router.use((req, res, next) => {
  req.prisma = new PrismaClient();
  next();
});

// get all actions
router.get('/', async (req, res) => {
  try {
    const actions = await req.prisma.userAction.findMany();
    if (actions.length > 0) {
      return res.json({
        payload: actions,
        message: 'All actions',
      });
    } else {
      return res.json({
        payload: [],
        message: 'No actions found',
      });
    }
  } catch (ex) {
    return res.status(403).json({ error: 'Something went wrong', stackTrace: ex });
  }
});

// get action by id
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const actions = await req.prisma.userAction.findMany({
      where: {
        userId: userId,
      },
      include: {
        action: {
          include: {
            Category: true,
          },
        },
      },
    });

    if (actions.length > 0) {
      return res.json({
        payload: actions,
        message: 'Actions found',
      });
    } else {
      return res.json({
        payload: [],
        message: 'No actions found',
      });
    }
  } catch (ex) {
    return res.status(422).json({
      message: 'Error retrieving actions',
      stackTrace: ex,
    });
  }
});

const createUserActionInput = z.object({
  name: z.string(),
  impact: z.number(),
  userId: z.string().uuid(),
  actionId: z.string().uuid(),
  description: z.string(),
  image: z.string().optional(),
});

router.post('/', async (req, res) => {
  const body = req.body;
  const result = createUserActionInput.safeParse(body);

  if (!result.success) {
    console.log(result.error);
    return res.status(400).json({
      message: 'Inputs incorrect',
      error: result.error.errors,
    });
  }

  try {
    const userAction = await req.prisma.userAction.create({
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
      const action = await req.prisma.action.findUnique({
        where: { id: body.actionId },
      });
      const user = await req.prisma.user.findUnique({
        where: { id: body.userId },
      });
      if (action && user) {
        await req.prisma.user.update({
          where: { id: body.userId },
          data: {
            totalUserActions: { increment: 1 },
            totalActionPoints: { increment: action.actionPoints },
            totalImpactPoints: { increment: action.impactPoints },
            totalCo2Saved: { increment: action.co2Saved },
            totalWaterSaved: { increment: action.waterSaved },
            totalWasteSaved: { increment: action.wasteSaved },
          },
        });
        return res.json({
          id: userAction.id,
          message: 'User action logged successfully',
        });
      } else {
        return res.json({
          message: 'Failed to log user action',
        });
      }
    } else {
      return res.status(500).json({ error: 'Failed to log user action' });
    }
  } catch (ex) {
    return res.status(500).json({ error: 'Something went wrong', stackTrace: ex });
  }
});

module.exports = router;
