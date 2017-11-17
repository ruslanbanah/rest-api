import express from 'express';

const router = express.Router();

router.get('/', require('./rnd'));

export default router;
