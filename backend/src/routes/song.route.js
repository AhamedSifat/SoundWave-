import { Router } from 'express';
import {
  getAllSongs,
  getFeaturedSongs,
  getTrendingSongs,
  getMadeForYouSongs,
} from '../controllers/song.controller.js';
import { protectRoute, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', protectRoute, requireAdmin, getAllSongs);
router.get('/featured', getFeaturedSongs);
router.get('/trending', getTrendingSongs);
router.get('/made-for-you', getMadeForYouSongs);

export default router;
