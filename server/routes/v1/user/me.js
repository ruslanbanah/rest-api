
function show(req, res) {
  return res.json(req.user);
}

export default show;
