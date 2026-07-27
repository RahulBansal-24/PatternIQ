import { Router } from 'express';
import {
  getEfficiencyTrend,
  getTaskCompletionTrend,
  getScreenTimeTrend,
  getWeeklyComparison,
  getMonthlyComparison,
  getFortnightlyInsights
} from '../controllers/chartsController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/efficiency', getEfficiencyTrend);
router.get('/task-completion', getTaskCompletionTrend);
router.get('/screen-time', getScreenTimeTrend);
router.get('/weekly-comparison', getWeeklyComparison);
router.get('/monthly-comparison', getMonthlyComparison);
router.get('/fortnightly-insights', getFortnightlyInsights);

export default router;
