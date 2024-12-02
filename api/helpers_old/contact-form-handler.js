const nodemailer = require("nodemailer");

async function contactFormHandler(inputs, exits) {
  const smtpTransport = nodemailer.createTransport({
    host: "email-smtp.ap-south-1.amazonaws.com",
    port: 587,
    secure: false,
    auth: {
      user: "AKIAYO5VSJX3AHFDU6DR",
      pass: "BE5P9Nv7Hz2gbBfzi2Q9TRq9ggIL/e+cPFIiR28x8Ado",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "City Innovation Exchange | <cix@forgeforward.in>",
    to: "cix@forgeforward.in",
    subject: "Contact form",
    text: `Verfication code to activate your account is`,
    html: `<p>Contact form has been submitted recently <br> First Name: ${inputs.data.fname} <br> Second Name: ${inputs.data.lname} <br> Email : ${inputs.data.email} <br> Phone : ${inputs.data.phone} <br> Short Description : ${inputs.data.shortdesc} <br> Long Description : ${inputs.data.longdesc} </p>`,
  };

  smtpTransport.sendMail(mailOptions, (err, res) => {
    if (err) throw err;
    return exits.success(res);
  });
}

module.exports = {
  friendlyName: "Contact form handler",
  description: "",
  inputs: {
    data: {
      type: "ref",
      description: "form data",
    },
  },
  exits: {
    success: {
      description: "All done.",
    },
  },
  fn: contactFormHandler,
};
