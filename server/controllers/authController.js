const {
  createUser,
  getUserByEmail,
  getUserById,
} = require("../models/authModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const sendCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hash = await argon2.hash(password);
    const newUser = { email, password: hash };

    const createdUser = await createUser(newUser);

    if (!createdUser) {
      return res.status(400).json({
        status: "fail",
        errors: [{ field: "root", message: "User not created" }],
      });
    }

    const token = signToken(createdUser.id);
    sendCookie(token, res);

    createdUser.password = undefined;

    res.status(201).json({
      status: "success",
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  return res.clearCookie("jwt").status(200).json({
    message: "You are logged out",
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    const token = signToken(user.id);
    sendCookie(token, res);

    user.password = undefined;
    user.id = undefined;

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAuthenticatedUser = async (req, res) => {
  try {
    req.user.password = undefined;
    req.user.created_at = undefined;
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt;

    if (!token) {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        401
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await getUserById(decoded.id);
    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token does no longer exist.",
        401
      );
    }
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
