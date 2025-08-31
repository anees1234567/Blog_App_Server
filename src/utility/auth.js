const jwt = require("jsonwebtoken");
const User = require("@models/UserModel/UserModel");
const { SECRET_KEY } = require("@config/index");
const { REFRESH_SECRET } = require("@config/index");
const { NotFoundError } = require("@utility/errors");

const generateToken = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
  
    
    if (!user) {
      throw new NotFoundError("Invalid email or password");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new NotFoundError("Invalid email or password");
    }
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "15m" } 
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      REFRESH_SECRET,
      { expiresIn: "7d" } 
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 1000, 
       path: "/",

    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
       path: "/",
    });

    user.refreshToken = refreshToken;
    await user.save();
    return {
        name: user.name,
        email: user.email,
        id: user._id,
        avatar:user.avatar,
        bio:user.bio,
        role:user.role
    }
  } catch (error) {
    throw new Error(error.message || "Failed to generate token.");
  }
};

const refreshTokenHandler = async (req, res, next) => {
  try {
    const refreshtoken = req.cookies?.refreshToken;
    if (!refreshtoken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }


    const decoded = jwt.verify(refreshtoken, REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshtoken) {
      throw new NotFoundError("Invalid refresh token");
    }
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "15m" } 
    );
     res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "none",
      maxAge: 15 * 60 * 1000, 
       path: "/",

    });
    return 

  } catch (error) {
    throw new Error(error.message || "Failed to refresh token.");
  }
};

module.exports = {generateToken,refreshTokenHandler};
