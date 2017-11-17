import User from '../../../models/user.model';

function show(req, res) {
  User.findById(req.user.id)
  return res.json(req.user);
}


export default show;
