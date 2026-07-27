import { Router } from 'express';
import { getDashboardData, getWeeklySummary } from '../controllers/dashboardController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/', getDashboardData);
router.get('/weekly-summary', getWeeklySummary);

export default router;
