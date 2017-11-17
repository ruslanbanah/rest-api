import User from '../../../models/user.model';
import { rbac } from '../../../middlewares/rbac.service'


function list(req, res, next) {
  rbac.isOk(req, 'list', req).then(()=>{
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip })
      .then(users => res.json(users))
      .catch(e => next(e));
  }).catch( err =>{
    next( err )
  })
}

export default list;
