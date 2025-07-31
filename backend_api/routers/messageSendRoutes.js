import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { sendMailController } from '../controllers/sendMailController.js';

const router = express.Router();

router.post('/sendMail', authenticateToken, sendMailController);

export default router;