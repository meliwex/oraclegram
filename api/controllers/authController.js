const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const { IsValidate, getErrors } = require("../utils/validation");
const jwt = require("../utils/jwt");

const User = mongoose.model("User");

exports.validate = function (method) {
  switch (method) {
    case "signup": {
      return [
        body("fullname", "Fullname is required!").exists(),
        body("username", "Username is required!").exists().toLowerCase(),
        body(
          "username",
          "Username can contain only letters or numbers!"
        ).isAlphanumeric(),
        body(
          "username",
          "Username must be at least 2 characters long!"
        ).isLength({
          min: 2,
        }),
        body("password", "Password is required!").exists(),
        body(
          "password",
          "Password must be at least 6 characters long"
        ).isLength({
          min: 6,
        }),
      ];
      break;
    }
    case "login": {
      return [
        body("username", "Username is required!").exists().toLowerCase(),
        body("password", "Password is required!").exists(),
      ];
    }
  }
};

exports.signup = async function (req, res) {
  try {
    if (!IsValidate(req))
      return res.status(400).send({ errors: getErrors(req) });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const { _id } = await newUser.save();

    const token = jwt.generateToken(_id);
    res.send({ token });
  } catch (err) {
    res.send({ message: err });
  }
};

exports.login = async function (req, res) {
  try {
    if (!IsValidate(req)) {
      return res.status(400).send({ errors: getErrors(req) });
    }

    const loginInput = req.body.username;
    const passwordInput = req.body.password;

    const user = await User.findOne({ username: loginInput });

    const result = await bcrypt.compare(passwordInput, user.password);

    if (result === false) {
      throw "";
    }

    const token = jwt.generateToken(user._id);
    res.send({ token });
  } catch (err) {
    res.status(400).send({ message: "Incorrect password or username" });
  }
};
