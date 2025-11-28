const nodemailer = require("nodemailer");
require('dotenv').config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  host:'smtp.gmail.com',
  auth: {
    user: process.env.APP_USER_NAME,
    pass: process.env.APP_PASSWORD
  },
});

module.exports.main=async function(message,sub,address){
  const info = await transporter.sendMail({
    from: process.env.APP_USER_NAME, // sender address
    to: address, // list of receivers
    subject: sub, // Subject line // plain text body
    html:message,
  });

  console.log("Message sent to",address);
}

//main().catch(console.error)