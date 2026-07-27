import { Router } from 'express';
import { createScreenTime, getScreenTime, getTodayScreenTime, getWeeklyScreenTime, getTodayScreenTimeStatus } from '../controllers/screenTimeController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.post('/', createScreenTime);
router.get('/', getScreenTime);
router.get('/today', getTodayScreenTime);
router.get('/today/status', getTodayScreenTimeStatus);
router.get('/weekly', getWeeklyScreenTime);

export default router;
