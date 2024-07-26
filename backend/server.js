import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createUser } = require('../src/api/createUser.js');
const {acquireSessionToken} = require('../src/api/acquireSessionToken.js');

dotenv.config();

const startServer = async () => {
  const sessionResult = await acquireSessionToken();

  const app = express();

  app.use(cors({
    origin: 'http://localhost:3000'
  }));

  app.use(express.json());

  app.post('/api/initialize_user', async (req, res) => {
    const idempotencyKey = req.body.idempotencyKey || uuidv4();

    const options = {
      method: "POST",
      url: "https://api.circle.com/v1/w3s/user/initialize",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        "X-User-Token": `${sessionResult.userToken}`,
      },
      data: { idempotencyKey: idempotencyKey, blockchains: ["MATIC-AMOY"] },
    };

    try {
      const response = await axios.request(options);
      console.log("Backend Response",response.data);
      res.status(200).json({ challengeId: response.data.data.challengeId });
    } catch (error) {
      console.error('Error in API request:', error.response?.data);
      res.status(500).json({ error: 'An error occurred', details: error.response?.data });
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '127.0.0.1', () => console.log(`Server running on ${PORT}`));
};

startServer();
