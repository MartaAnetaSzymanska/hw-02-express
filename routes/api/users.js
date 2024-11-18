const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs").promises;

require("dotenv").config();
const secret = process.env.SECRET;

const User = require("../../models/user");
const auth = require("../../middleware/auth");
const { avatarsDir, upload } = require("../../middleware/upload");
const { isImageAndTransform } = require("../../service/services");

const Joi = require("joi");

const userValidationSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{3,30}$")),
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
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const newUser = new User({ email, avatarURL });
    await newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      user: {
        email: newUser.email,
        subcription: newUser.subscription,
        avatarURL: newUser.avatarURL,
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
    const user = await User.findOne({ email });
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
        avatarURL: user.avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get("/current", auth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, secret);

    const user = await User.findById(decodedToken.id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File isn't a photo" });
      }
      const { path: tempPath } = req.file;
      const ext = path.extname(tempPath);
      const newAvatarName = `${req.user._id}${ext}`;
      const newAvatarPath = path.join(avatarsDir, newAvatarName);

      try {
        await fs.rename(tempPath, newAvatarPath);
      } catch (e) {
        await fs.unlink(tempPath);
        return next(e);
      }

      const isValidAndTransform = await isImageAndTransform(newAvatarPath);
      if (!isValidAndTransform) {
        await fs.unlink(newAvatarPath);
        return res.status(400).json({ message: "File isn't a photo" });
      }

      const avatarURL = `/avatars/${newAvatarName}`;
      await User.findByIdAndUpdate(req.user._id, { avatarURL });

      res.status(200).json({ avatarURL });
    } catch (err) {
      return next(err);
    }
  }
);
module.exports = router;
