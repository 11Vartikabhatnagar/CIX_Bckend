const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("NO_AUTH_HEADER_FOUND");
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, sails.config.globals.ACCESS_TOKEN_SECRET);
    req.userdata = decoded;
    next();
  } catch (err) {
    await sails.helpers.errorHandler(res, err);
  }
};
