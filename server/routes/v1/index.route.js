import express from 'express';
import userRoutes from './user/index';
import authRoutes from './auth/index';
import rndRoutes from './random-number/index';

const router = express.Router();

router.get('/ping', (req, res)=> res.json({status: 'ok'}))

router.use('/users', userRoutes);

router.use('/auth', authRoutes);

router.use('/random-number', rndRoutes);

export default router;
