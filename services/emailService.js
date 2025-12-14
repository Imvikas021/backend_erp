const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

console.log("SMTP_USER:", process.env.SMTP_USER ? "ok" : "MISSING");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "ok" : "MISSING");

exports.sendEmailSMTP = async ({ to, subject, message, attachments }) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text: message,
    attachments: attachments
  });
};