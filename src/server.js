require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Import routes
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const actionRouter = require('./routes/action');
const userActionRouter = require('./routes/userAction');
const categoryRouter = require('./routes/category');
const recommendationRouter = require('./routes/recommendation');
const notificationRouter = require('./routes/notification');
const challengeRouter = require('./routes/challenge');
const badgeRouter = require('./routes/badge');
const challengeActionRouter = require('./routes/challengeAction');

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
