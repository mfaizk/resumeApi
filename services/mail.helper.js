const nodemailer = require("nodemailer");
const config = require("../config/index");
const transpoter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_HOST,
  secure: false,
  auth: {
    user: config.SMTP_AUTH_USER,
    pass: config.SMTP_AUTH_PASS,
  },
});

module.exports = transpoter;
