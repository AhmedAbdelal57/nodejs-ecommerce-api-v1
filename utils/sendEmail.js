const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1- create transporter (service that will send email "gmail,Mailgun,etc")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, //if secure false it will be 587 , if secure true it will be 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2- define email options (like from ,to,subject,message)
  const mailOptions = {
    from: `E-Shop <${process.env.EMAIL_USERNAME}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };
  // 3- send email to user
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
