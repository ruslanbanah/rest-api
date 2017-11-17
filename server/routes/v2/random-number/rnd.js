
function getRandomNumber(req, res) {
  return res.json({
    user: req.user,
    num: Math.random() * 100,
  });
}

export default getRandomNumber
