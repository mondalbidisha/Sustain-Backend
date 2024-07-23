const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { signinInput, signupInput } = require('@aadeshk/medium-common');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  const body = req.body;
  const { success } = signupInput.safeParse(body);
  if (!success) {
    return res.status(411).json({
      message: 'Invalid email or password.',
    });
  }
  try {
    const user = await prisma.user.findFirst({
      where: { email: body.email },
    });
    if (user) {
      return res.status(409).json({ error: 'User with the email already exists' });
    }
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET);
    return res.status(200).json({
      message: 'Sign up successful',
      jwt: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (ex) {
    return res.status(403).json({ error: 'Forbidden', stackTrace: ex });
  }
});

router.post('/signin', async (req, res) => {
  const body = req.body;
  const { success } = signinInput.safeParse(body);
  if (!success) {
    return res.status(411).json({
      message: 'Invalid email or password.',
    });
  }
  try {
    const email = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!email) {
      return res.status(403).json({ error: 'Account with this email does not exist.' });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!user) {
      return res.status(403).json({ error: 'Email and Password Mismatch' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    return res.json({
      jwt: token,
      user: user,
      message: 'Sign in successful',
    });
  } catch (ex) {
    return res.status(403).json({ error: 'Forbidden', stackTrace: ex });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    if (userId) {
      const user = await prisma.user.findFirst({
        where: { id: userId },
        include: {
          UserBadges: true,
          UserAction: {
            include: { action: true },
          },
        },
      });
      if (!user) {
        return res.status(404).json({ error: 'User does not exist' });
      } else {
        return res.json({
          user,
          message: 'Found user',
        });
      }
    } else {
      return res.status(400).json({ error: 'Invalid userId' });
    }
  } catch (ex) {
    return res.status(403).json({ error: 'Unauthorized request', stackTrace: ex });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (users.length > 0) {
      return res.json({
        payload: users,
        message: 'All users',
      });
    } else {
      return res.json({
        payload: [],
        message: 'No users found',
      });
    }
  } catch (ex) {
    return res.status(403).json({ error: 'Forbidden', stackTrace: ex });
  }
});

router.get('/challenges/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const userWithChallenges = await prisma.user.findMany({
      where: { id: userId },
      include: {
        UserChallenge: {
          include: {
            challenge: {
              include: {
                ChallengeActions: {
                  include: { action: true },
                },
              },
            },
          },
        },
      },
    });
    if (!userWithChallenges) {
      return res.status(404).json({
        payload: [],
        message: 'No challenges found',
      });
    } else {
      return res.json({
        payload: userWithChallenges,
        message: 'All user challenges',
      });
    }
  } catch (ex) {
    return res.status(403).json({ error: 'Forbidden', stackTrace: ex });
  }
});

const updateFcmTokenSchema = z.object({
  userId: z.string(),
  token: z.string(),
});

router.post('/save-token', async (req, res) => {
  try {
    const body = req.body;
    const { success, error } = updateFcmTokenSchema.safeParse(body);
    if (!success) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.status(400).json({
        error: 'Invalid Inputs',
        details: error.errors,
      });
    }
    const user = await prisma.user.update({
      where: { 
        id: body.userId 
      },
      data: { 
        fcmToken: body.token 
      },
    });
    if (user) {
      return res.json({
        userId: user.id,
        message: 'User Token saved successfully',
      });
    } else {
      return res.status(500).json({
        error: 'Failed to save user token',
      });
    }
  } catch (ex) {
    return res.status(403).json({ error: 'Something went wrong', stackTrace: ex });
  }
});

module.exports = router;
