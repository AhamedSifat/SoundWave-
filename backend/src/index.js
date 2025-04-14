import express, { json } from 'express';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';

import { createServer } from 'http';
import { initializeSocket } from './utils/socket.js';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';
import { connectDB } from './utils/db.js';
dotenv.config();

const app = express();
const __dirname = path.resolve();

const httpserver = createServer(app);
initializeSocket(httpserver);

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(clerkMiddleware()); //this will add auth to req obj
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB  max file size
    },
  })
);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

httpserver.listen(process.env.PORT, () => {
  connectDB();
  console.log(`server is running on port ${process.env.PORT}`);
});
