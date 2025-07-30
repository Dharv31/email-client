import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { forwardWithAttachment } from '../controllers/forwardController.js';

const router = express.Router();

// Route to handle forwarding a message with an optional attachment
router.post('/forward', authenticateToken, forwardWithAttachment);

export default router;