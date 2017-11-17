import { rbac } from '../../../middlewares/rbac.service'

function update(req, res, next) {
  rbac.isOk(req, 'update', req).then(()=>{
    const user = req.user
    Object.assign(user, req.body)
    user.save()
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
  }).catch( err =>{
    next( err )
  })
}

export default update;
