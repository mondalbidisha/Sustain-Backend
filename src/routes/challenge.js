const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const router = express.Router();

// Middleware to use the extended Prisma Client with Accelerate
router.use((req, res, next) => {
  req.prisma = new PrismaClient();
  next();
});

const createChallengeInput = z.object({
  userId: z.string().uuid(),
  challengeId: z.string().uuid(),
});

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await req.prisma.challenge.findMany();
    if (challenges.length > 0) {
      res.json({
        payload: challenges,
        message: "All challenges",
      });
    } else {
      res.json({
        payload: [],
        message: "No challenges found",
      });
    }
  } catch (ex) {
    res.status(403).json({
      message: "Error while fetching challenges",
      error: ex.message,
    });
  }
});

// Join a challenge
router.post('/join', async (req, res) => {
  const body = req.body;
  const { success, error } = createChallengeInput.safeParse(body);
  if (!success) {
    console.log(error);
    res.status(400).json({
      message: "Invalid inputs",
      error: error.errors, // Provide the detailed validation error
    });
    return;
  }

  try {
    const existingUserChallenge = await req.prisma.userChallenge.findFirst({
      where: {
        userId: body.userId,
        challengeId: body.challengeId,
      },
    });

    if (!existingUserChallenge) {
      const userChallenge = await req.prisma.userChallenge.create({
        data: {
          userId: body.userId,
          challengeId: body.challengeId,
        },
      });
      if (userChallenge && userChallenge.id) {
        res.json({
          id: userChallenge.id,
          message: "User challenge initiated successfully",
        });
      } else {
        res.json({
          message: "User challenge initiation failed",
        });
      }
    } else {
      res.json({
        message: "User already enrolled in challenge.",
      });
    }
  } catch (ex) {
    res.status(500).json({
      error: 'Something went wrong',
      stackTrace: ex.message,
    });
  }
});

module.exports = router;
