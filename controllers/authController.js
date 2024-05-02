const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { name: "", lastname: "", email: "", password: "" };
  if (err.message === "Incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message === "Incorrect password" || err.message === "Invalid password") {
    errors.password = "Wrong password";
  }
  if (err.code === 11000) {
    errors.email = "A user with this email already exists.";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};


const createToken = (id) => {
  return jwt.sign({ id }, "Rahim secret");
};

module.exports.signup_post = async (req, res) => {
  const { name, lastname, email, password } = req.body;
  try {
    const user = await User.create({ name, lastname, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(201).json(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
