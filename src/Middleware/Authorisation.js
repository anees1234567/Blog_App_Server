const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("@config/index");
const { TokenError } = require("@utility/errors");

async function authorisation(req, res, next) {
  try {
    const openPaths = ["/user/createUser", "/user/loginUser", "/user/refresh"];
    if (openPaths.includes(req.path)) {
      return next();
    }
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new TokenError("Authorization failed: No token provided");
    }
    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
       throw new TokenError(error.message);
  }
}

module.exports = authorisation;
