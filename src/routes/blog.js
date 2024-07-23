const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { createBlogInput, updateBlogInput } = require('@aadeshk/medium-common');
const { buildQuery, buildPostSearchQuery } = require('./../db/queries');
const { generateBlogPost } = require('./../postGenerator');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const router = express.Router();

router.use((req, res, next) => {
  req.prisma = new PrismaClient();
  next();
});

router.get('/bulk/:id?', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || DEFAULT_PAGE, 1);
    const pageSize = Math.max(parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE, 1);
    const query = buildQuery();
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
    const posts = await req.prisma.post.findMany(query);
    const countQuery = buildQuery();
    delete countQuery.skip;
    delete countQuery.take;
    const totalCount = await req.prisma.post.count({ where: countQuery.where });
    res.json({
      posts: posts,
      totalCount: totalCount,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (e) {
    res.status(411).json({
      message: 'Error while fetching post',
      error: e
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const postQuery = buildPostSearchQuery(keyword);
    const posts = await req.prisma.post.findMany(postQuery);
    res.json({ posts: posts });
  } catch (e) {
    res.status(411).json({
      message: 'Error while fetching post',
      error: e,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    if (postId) {
      const post = await req.prisma.post.findFirst({
        where: { id: postId },
        select: {
          title: true,
          content: true,
          publishedDate: true,
          id: true,
          blogImage: true,
        },
      });
      if (post && post.id) {
        res.json({ post: { ...post } });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid postId' });
    }
  } catch (e) {
    res.status(411).json({ message: 'Error while fetching post', stackTrace: e });
  }
});

router.post('/', async (req, res) => {
  const { success, data: body } = createBlogInput.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ message: 'Inputs incorrect' });
  }
  try {
    const post = await req.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        published: true,
      },
    });
    res.json({ id: post.id });
  } catch (ex) {
    res.status(403).json({ error: 'Something went wrong', stackTrace: ex });
  }
});

router.put('/', async (req, res) => {
  const { success, data: body } = updateBlogInput.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ message: 'Inputs incorrect' });
  }
  try {
    const post = await req.prisma.post.update({
      where: { id: body.id },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    res.json({ id: post.id });
  } catch (ex) {
    res.status(403).json({ error: 'Something went wrong', stackTrace: ex });
  }
});

router.get('/generate/post', async (req, res) => {
  try {
    const blogs = await req.prisma.post.findMany();
    const blogTitles = blogs.length > 0 ? blogs.map(blog => `Blog Title : ${blog.title}`) : [];
    const response = await generateBlogPost(blogTitles);
    if (response.title && response.content) {
      const post = await req.prisma.post.create({
        data: {
          title: response.title,
          content: response.content,
          published: true
        },
      });
      if (post && post.id) {
        res.json({ post: post, message: 'Blog post generated successfully' });
      } else {
        res.status(500).json({ message: 'Post creation failure' });
      }
    } else {
      res.status(500).json({ message: 'Gemini post generation failed' });
    }
  } catch (ex) {
    res.status(500).json({ error: 'Something went wrong', stackTrace: ex });
  }
});

module.exports = router;
