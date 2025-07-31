import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getFolders } from '../controllers/folderController.js';
import { getFoldersMessage, deleteMessage } from '../controllers/folderMessageController.js';

const router = express.Router();

router.get('/folders', authenticateToken, getFolders);
router.get('/folders/:folderId/messages', authenticateToken, getFoldersMessage);
router.delete('/folders/:folderId/messages/:messageId', authenticateToken, deleteMessage);

export default router;