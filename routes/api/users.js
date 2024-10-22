const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("dotenv").config();
const secret = process.env.SECRET;

const User = require("../../models/user");
const Joi = require("joi");

const userValidationSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

router.post("/signup", async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: `missing required ${error.details[0].path[0]} field`,
    });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      message: "Email is already in use",
    });
  }
  try {
    const newUser = new User({ email });
    await newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      user: {
        email: newUser.email,
        subcription: newUser.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: `missing required ${error.details[0].path[0]} field`,
    });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    const passwordIsValid = await user.validatePassword(password);
    if (!user || !passwordIsValid) {
      return res.status(401).json({
        message: "Email or password wrong",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
