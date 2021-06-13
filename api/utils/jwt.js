const jwt = require("jsonwebtoken");

exports.generateToken = function (id) {
  const token = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: 86400 * 30,
  });
  return token;
};

exports.authenticateToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};
