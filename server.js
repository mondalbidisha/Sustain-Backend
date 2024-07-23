require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 4000;

// Import routes
const userRouter = require('./src/routes/user');
const blogRouter = require('./src/routes/blog');
const actionRouter = require('./src/routes/action');
const userActionRouter = require('./src/routes/userAction');
const categoryRouter = require('./src/routes/category');
const recommendationRouter = require('./src/routes/recommendation');
const notificationRouter = require('./src/routes/notification');
const challengeRouter = require('./src/routes/challenge');
const badgeRouter = require('./src/routes/badge');
const challengeActionRouter = require('./src/routes/challengeAction');

// Use routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/action', actionRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/userAction', userActionRouter);
app.use('/api/v1/recommendation', recommendationRouter);
app.use('/api/v1/notification', notificationRouter);
app.use('/api/v1/challenge', challengeRouter);
app.use('/api/v1/challengeAction', challengeActionRouter);
app.use('/api/v1/badge', badgeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
