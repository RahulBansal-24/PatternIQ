import { Router } from 'express';
import { createReflection, getReflections, getTodayReflection } from '../controllers/reflectionController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.post('/', createReflection);
router.get('/', getReflections);
router.get('/today', getTodayReflection);

export default router;
