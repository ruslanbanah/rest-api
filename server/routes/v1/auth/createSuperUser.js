import User from '../../../models/user.model'
import { hash } from '../../../helpers/hash.helper'

function createSuperUser(req, res, next) {
  let params = {"username":"admin","email":"admin@admin.com", "password":"admin", "role":"admin"}
  params.password = hash(params.password)
  const user = new User(params);
  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

export default createSuperUser;
