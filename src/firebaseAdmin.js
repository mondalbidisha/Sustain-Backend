const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    'project_id': process.env.FIREBASE_API_PROJECT_ID, 
    'client_email': process.env.FIREBASE_API_CLIENT_EMAIL, 
    'client_id': process.env.FIREBASE_API_CLIENT_ID,
    'private_key': process.env.FIREBASE_API_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
});

module.exports = admin;
