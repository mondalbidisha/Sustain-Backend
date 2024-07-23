const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

router.use((req, res, next) => {
  req.prisma = new PrismaClient();
  next();
});

router.get('/', async (req, res) => {
  try {
    const categories = await req.prisma.category.findMany();
    if (categories.length) {
      return res.json({
        payload: categories,
        message: 'All action categories',
      });
    } else {
      return res.json({
        payload: [],
        message: 'No categories',
      });
    }
  } catch (ex) {
    return res.status(403).json({ 
      error: 'Something went wrong', 
      stackTrace: ex 
    });
  }
});

router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;
  try {
    const categories = await req.prisma.action.findMany({
      where: {
        id: categoryId,
      },
    });
    if (categories.length > 0) {
      return res.json({
        payload: categories,
        message: 'Categories found',
      });
    } else {
      return res.json({
        payload: [],
        message: 'No categories found',
      });
    }
  } catch (ex) {
    return res.status(422).json({
      message: 'Error retrieving categories',
      stackTrace: ex,
    });
  }
});

module.exports = router;
