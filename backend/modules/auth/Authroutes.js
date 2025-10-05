import express from 'express';
const router = express.Router();
import { register, login, fetchProfile } from './Authcontrollers.js';
import { requireAuth } from '../../middlewares/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, fetchProfile);

export default router;