import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routers/authRoutes.js';
import graphRoutes from './routers/graphRoutes.js';
import folderRoutes from './routers/folderRoutes.js';
import messageSendRoutes from './routers/messageSendRoutes.js';
import replyRoutes from './routers/replyRoutes.js';
import forwardRoutes from './routers/forwardRoutes.js';
import tokenRoutes from './routers/tokenRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', graphRoutes);
app.use('/api', folderRoutes);
app.use('/api', messageSendRoutes);
app.use('/api', replyRoutes);
app.use('/api', forwardRoutes);
app.use('/api', tokenRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
