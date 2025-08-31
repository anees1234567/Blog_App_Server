const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("@config/index");
const { TokenError } = require("@utility/errors");

async function authorisation(req, res, next) {
  try {
    const openPaths = ["/user/createUser", "/user/loginUser", "/user/refresh", "/blog/getAllBlogs"];
    if (openPaths.includes(req.path)) {
      return next();
    }

    const token = req.cookies?.accessToken; 
    if (!token) {
      throw new TokenError("Token not found in cookie");
    } 
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
       throw new TokenError(error.message);
  }
}

module.exports = authorisation;
