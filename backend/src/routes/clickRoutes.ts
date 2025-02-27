import express from 'express';
import { recordClick, getClickHistory, getClickStats } from '../controllers/clickController';
import { auth } from '../middleware/auth';
import { clickRateLimiter, validateClick } from '../middleware/clickRateLimiter';

const router = express.Router();

// POST /api/clicks - Record a new click
router.post('/', auth, clickRateLimiter, validateClick, recordClick);

// GET /api/clicks/history - Get user's click history
router.get('/history', auth, getClickHistory);

// GET /api/clicks/stats - Get click statistics
router.get('/stats', auth, getClickStats);

export default router; 