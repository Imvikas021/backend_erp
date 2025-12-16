const sgMail = require("@sendgrid/mail");


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendMail ({ to, subject, message, attachments}) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text: message,
    attachments,
  };
  await sgMail.send(msg);
}

module.exports = {sendMail};

////const transporter = nodemailer.createTransport({
  //host: "smtp.gmail.com",
  //port: 587,
  //secure: false,
  //auth: {
  //  user: process.env.SMTP_USER,
   // pass: process.env.SMTP_PASS
 // }
//});


//exports.sendEmailSMTP = async ({ to, subject, message, attachments }) => {
  //await transporter.sendMail({
    //from: process.env.SMTP_USER,
    //to,
    //subject,
    //text: message,
    //attachments: attachments
  //});
//};