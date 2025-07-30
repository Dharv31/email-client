import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getMessages } from '../controllers/graphController.js';

const router = express.Router();

router.get('/messages', authenticateToken, getMessages);

export default router;
