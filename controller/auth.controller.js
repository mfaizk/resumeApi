const BigPromise = require("../services/big_promise");
const GlobalResponse = require("../services/global_response");
const USER = require("../models/user.model");
const crypto = require("crypto");
const transporter = require("../services/mail.helper");
//Signup controller started

const signup = BigPromise(async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return GlobalResponse(res, "Insufficient data", false, 401, []);
  }
  const user = await USER.findOne({ email });
  if (user) return GlobalResponse(res, "Email already exist", false, 401, []);
  const data = await USER.create({
    email: email,
    password: password,
  });
  data.password = undefined;
  return GlobalResponse(res, "User account created", true, 201, data);
});

//Signup controller END

//SignIn controller Start

const signin = BigPromise(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return GlobalResponse(res, "Insufficient data", false, 401, []);
  }
  const user = await USER.findOne({ email }).select("+password");
  if (!user) {
    return GlobalResponse(res, "user doesn't exist", false, 401, []);
  }
  if (!(await user.comparePassword(password))) {
    return GlobalResponse(res, "email or passsword is invalid", false, 401, []);
  }

  const token = await user.generateJWTToken();
  res.cookie("token", token, { httpOnly: true });
  return GlobalResponse(res, "Logged in successfully", true, 201, {
    token: token,
  });
});

//SignIn controller END

//forgetPassword controller Start
const forgetPassword = BigPromise(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return GlobalResponse(res, "Insufficient data", false, 401, []);
  }
  const user = await USER.findOne({ email }).select(
    "+forgetPasswordToken,+forgetPasswordTokenExpiry"
  );
  if (!user) {
    return GlobalResponse(res, "User doesn't exist", false, 401, []);
  }
  const token = await user.generateForgetPasswordToken();
  await user.save();
  try {
    transporter.sendMail({
      from: '"JJ"<jj@j.com>',
      to: user.email,
      text: "Password reset link",
      html: `<a href=${req.protocol}://${req.get(
        "host"
      )}/api/auth/resetpass/${token}>Click me to reset password</a>`,
    });
  } catch (error) {
    (user.forgetPasswordToken = undefined),
      (user.forgetPasswordTokenExpiry = undefined),
      await user.save();
    return GlobalResponse(res, "Unable to send mail", false, 401, []);
  }

  return GlobalResponse(res, "Recovery link sent to email", true, 201, []);
});
//forgetPassword controller End

//RESETPassword controller Start

const resetPassword = BigPromise(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!(id && password)) {
    return GlobalResponse(res, "Insuffcient data", false, 401, []);
  }
  const token = crypto.createHash("sha256").update(id).digest("hex");
  const user = await USER.findOne({ forgetPasswordToken: token }).select(
    "+password,+forgetPasswordTokenExpiry,+forgetPasswordToken"
  );
  if (!user) {
    return GlobalResponse(res, "User doesn't exist", false, 401, []);
  }

  if (user.forgetPasswordTokenExpiry > Date.now()) {
    return GlobalResponse(res, "Token expired", false, 401, []);
  }
  user.password = password;
  user.forgetPasswordTokenExpiry = undefined;
  user.forgetPasswordToken = undefined;
  await user.save();
  return GlobalResponse(res, "Password reset successfull", true, 201, []);
});
//RESETPassword controller End

module.exports = {
  signin,
  signup,
  forgetPassword,
  resetPassword,
};
