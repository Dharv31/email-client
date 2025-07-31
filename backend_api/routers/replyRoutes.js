import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { replyWithAttachment } from '../controllers/replyController.js';

const router = express.Router();

// Route to handle replying to a message with an optional attachment
router.post('/reply', authenticateToken, replyWithAttachment);

export default router;