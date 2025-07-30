import express from 'express';

import { getToken } from '../controllers/tokenController.js';

const router = express.Router();


// Route to get the token
router.get('/getToken', getToken);


export default router;