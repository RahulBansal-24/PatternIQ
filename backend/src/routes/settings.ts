import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
