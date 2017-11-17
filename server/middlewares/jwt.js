import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import config from '../../config/config'
import APIError from '../helpers/APIError'
import httpStatus from 'http-status'

module.exports = (req, res, next)=>{
  if(!config || !config.jwtSecret) throw new Error('secret should be set')
  let token
  if(req.method === 'OPTIONS' && req.headers.hasOwnProperty('access-control-request-headers')) {
    let hasAuthInAccessControl = !!~req.headers['access-control-request-headers']
      .split(',').map((header) => {
        return header.trim();
      }).indexOf('authorization');
  
    if(hasAuthInAccessControl) return next();
  }

  if(req.headers && req.headers.authorization) {
    let parts = req.headers.authorization.split(' ')
    if(parts.length == 2) {
      let scheme = parts[0];
      let credentials = parts[1];
    
      if(/^Bearer$/i.test(scheme)) {
        token = credentials
      } else next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true))
    } else next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true))
  }
  if(!token) {
    return next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, false));
  }
  try {
    let userJwt = jwt.verify(token, config.jwtSecret)
    if(!userJwt) next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true))
    User.get(userJwt.id).then( authUser => {
      if(!authUser.email) next(new APIError('Unauthorized1', httpStatus.UNAUTHORIZED, true))
      Object.assign(req, { authUser })
      next()
    }).catch( () => {
      next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true))
    })
  } catch (err) {
    next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true))
  }
}

