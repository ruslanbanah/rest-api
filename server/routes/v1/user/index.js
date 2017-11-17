import express from 'express';
import validation from 'express-validation'
import {createUser, updateUser} from './user.validation'
import jwt from '../../../middlewares/jwt'

const router = express.Router();

router.use(jwt)

router.get('/', require('./list'))
router.get('/@me', require('./me'))
router.post('/', validation(createUser), require('./create'));
router.get('/:userId', require('./show'))
router.put('/:userId', validation(updateUser), require('./update'))
router.delete('/:userId', require('./delete'));

router.param('userId', require('./load'));

export default router;
