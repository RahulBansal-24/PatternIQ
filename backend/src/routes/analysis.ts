import { Router } from 'express';
import { getAnalysis, getLatestAnalysis, generateAnalysis, getBehaviorPatterns } from '../controllers/analysisController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/', getAnalysis);
router.get('/latest', getLatestAnalysis);
router.post('/generate', generateAnalysis);
router.get('/patterns', getBehaviorPatterns);

export default router;
