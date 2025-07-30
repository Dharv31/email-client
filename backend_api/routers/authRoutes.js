import express from 'express';
import { login, handleRedirect } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', login);
router.get('/redirect', handleRedirect);

export default router;
