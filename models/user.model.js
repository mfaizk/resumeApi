const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const UserModel = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "Insufficient data"],
  },
  password: {
    type: String,
    select: false,
    required: [true, "Insufficient data"],
    minlength: [8, "Minimum 8 character password required"],
  },
});

UserModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  // console.log(this.password);
  return next();
});

UserModel.methods = {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  },
  async generateJWTToken() {
    return jwt.sign({ email: this.email, _id: this._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES,
    });
  },
};

module.exports = mongoose.model("user", UserModel);
