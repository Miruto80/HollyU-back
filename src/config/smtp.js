import nodemailer from "nodemailer";
import config from "./config.js";

export const smtpTransport = nodemailer.createTransport({
  host: config.smtpserver,
  port: config.smtpports,
  secure: config.smtpports === 465,
  auth: {
    user: config.smtpuser,
    pass: config.smtppass,
  },
});