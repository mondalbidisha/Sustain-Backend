const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();

router.use((req, res, next) => {
  req.prisma = new PrismaClient();
  next();
});

router.get('/', async (req, res) => {
  try {
    const actions = await req.prisma.action.findMany();
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
    return res.status(422).json({
      error: 'Something went wrong',
      stackTrace: ex,
    });
  }
});

router.get('/:id', async (req, res) => {
  const actionId = req.params.id;
  try {
    const action = await req.prisma.action.findUnique({
      where: {
        id: actionId,
      },
    });
    if (action) {
      return res.json({
        payload: action,
        message: 'Action found',
      });
    } else {
      return res.status(404).json({
        message: 'No actions found',
      });
    }
  } catch (ex) {
    return res.status(422).json({
      error: 'Something went wrong',
      stackTrace: ex,
    });
  }
});

router.get('/category/:id', async (req, res) => {
  const categoryId = req.params.id; 
  try {
    if (categoryId) {
      const actions = await req.prisma.action.findMany({
        where: {
          categoryId: categoryId,
        },
      });
      if (actions.length > 0) {
        return res.json({
          payload: actions,
          message: 'Actions found',
        });
      } else {
        return res.status(404).json({
          message: 'No actions found for this category',
        });
      }
    } else {
      return res.status(400).json({
        message: 'Invalid category',
      });
    }
  } catch (ex) {
    return res.status(422).json({
      error: 'Something went wrong',
      stackTrace: ex,
    });
  }
});

module.exports = router;
