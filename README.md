# Sustain Backend

Sustain-Backend is the Node.js backend service that powers the Beacon Of Change and EcoVerse frontend applications. 
This backend service provides APIs for logging sustainability actions, sustainability challenges, earn badges, action and reward points as well as visualise real world measurable impact.

## Features

1. Sustainable action logging API,s along with classification of actions into different categories.
2. Sustainability challenges API's, that allows user's to join challenges and log challenge specific actions.
3. Visualise real world measurable impact of various actions logged by users.
4. Recommended Actions API, to send recommended actions to active users via firebase push notifications.
5. Notifications API, to send reminder notifications to user's to increase engagement.

## Getting Started

Follow these steps to get the backend service running on your local machine.

### Prerequisites
Ensure you have the following installed:

1. Node.js (>=14.x)
2. npm (>=6.x)

### Installation

Clone the repository:
```bash
git clone git@github.com:mondalbidisha/Sustain-Backend.git
cd Sustain-Backend
```

Install the dependencies:
```bash
npm install
```

### Environment Variables

Create a .env file in the root directory and add the following environment variables:
```bash
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_KEYS ...
```

1. Ths project uses Prisma with Prisma Accelarate as an ORM with Supabase PostgreSQL. (Refer - https://supabase.com/partners/integrations/prisma).
2. This project uses Firebase to send push notifications. Generate Firebase Service Account API Keys here - https://firebase.google.com/docs/admin/setup.
3. This project uses Gemini AI API's. Generate your Gemini API Key here - https://ai.google.dev/gemini-api/docs/api-key.

### Running the App

Start the development server:
```bash
node server.js
```
The backend service will be running at http://localhost:4000.

Thank you for using Sustain-Backend! Your contribution helps us create a better world. 🌍🌱
