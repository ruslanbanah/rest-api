import express from 'express';
import rndRoutes from './random-number/index';

const router = express.Router();

router.get('/ping', (req, res)=> res.json({status: 'ok'}))

router.use('/random-number', rndRoutes);

export default router;
