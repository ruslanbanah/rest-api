import User from '../../../models/user.model';
import userStatus from '../../../helpers/userStatus'
import userRoles from '../../../helpers/userRoles'
import { hash, randomHash } from '../../../helpers/hash.helper'
import { rbac } from '../../../middlewares/rbac.service'

function create(req, res, next) {
  rbac.isOk(req, 'create', req).then(()=>{
    const defaultParams = {
      status: userStatus[0],
      role: userRoles[0],
      emailConfirmHash: randomHash(),
    }
    let params = Object.assign(defaultParams, req.body)
    params.password = hash(params.password)
    const user = new User(params);
    user.save()
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
  }).catch( err =>{
    next( err )
  })
}

export default create;
