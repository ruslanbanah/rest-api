import Joi from 'joi'
import jwt from 'jsonwebtoken';
import { isValidPass } from '../../../helpers/hash.helper'
import User from '../../../models/user.model'
import httpStatus from 'http-status';
import APIError from '../../../helpers/APIError';
import config from '../../../../config/config';

const schema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

function auth(req, res, next) {
  const result = Joi.validate(req.body, schema);
  if(result.error) next(result.error)
  
  User.getByEmail(req.body.email).then( user =>{
    if(!user) {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
    if(isValidPass(user.password, req.body.password)){
      const token = jwt.sign({
        id: user._id,
        email: user.email,
      }, config.jwtSecret);
      return res.json({
        token,
        id: user._id,
        email: user.email,
      });
    } else {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
  }).catch(()=>{
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  })
}

export default auth
