import express from 'express';
import validation from 'express-validation'
import {authValid} from './auth.validation'

const router = express.Router();

router.post('/login', validation(authValid), require('./auth'));
router.post('/superuser', require('../auth/createSuperUser'));

export default router;
