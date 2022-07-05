const sendMail = async (input) => {
  const nodemailer = require("nodemailer");
  const mg = require("nodemailer-mailgun-transport");
  const handlebars = require("handlebars");
  const fs = require("fs");
  const path = require("path");
  const config = require("../config");

  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "..", "templates", "user-registration-email.hbs"),
    "utf8"
  );
  const mailgunAuth = {
    auth: {
      api_key: config.mailgun.apiKey,
      domain: config.mailgun.domain,
    },
  };
  const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));
  const template = handlebars.compile(emailTemplateSource);
  const htmlToSend = template({ ...input.body });

  const mailOptions = {
    from: config.mailgun.fromAddress,
    to: input.to,
    subject: input.subject,
    html: htmlToSend,
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Successfully sent email.");
    }
  });
};

module.exports = sendMail;
