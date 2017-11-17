import express from 'express';
import jwt from '../../../middlewares/jwt'

const router = express.Router();

router.use(jwt)
router.get('/', require('./rnd'));

export default router;
