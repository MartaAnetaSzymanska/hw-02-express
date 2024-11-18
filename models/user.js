const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");
const { string } = require("joi");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
  },
});

userSchema.methods.setPassword = async function (password) {
  this.password = await bCrypt.hash(password, await bCrypt.genSalt(6));
};

userSchema.methods.validatePassword = async function (password) {
  return await bCrypt.compare(password, this.password);
};
const User = mongoose.model("user", userSchema, "users");

module.exports = User;
