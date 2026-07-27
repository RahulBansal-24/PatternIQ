import { Router } from 'express';
import { register, login, refreshToken, logout, getProfile, deleteAccount } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);
router.get('/profile', auth, getProfile);
router.delete('/delete-account', auth, deleteAccount);

export default router;
