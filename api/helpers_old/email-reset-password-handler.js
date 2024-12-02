const nodemailer = require("nodemailer");

async function OTPMailer(inputs, exits) {
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
    to: inputs.otp.sendto,
    subject: "Verification code",
    text: `Verfication code to reset your account password is  ${inputs.otp.code}`,
    html: `<p>Verfication code to reset your account password is <b>${inputs.otp.code}</b></p>`,
  };

  smtpTransport.sendMail(mailOptions, (err, res) => {
    if (err) throw err;
    return exits.success(res);
  });
}

module.exports = {
  friendlyName: "OTP mailer",
  description: "A function to handle OTP email",
  inputs: {
    otp: {
      type: "ref",
      description: "OTP Code",
    },
  },
  exits: {},
  fn: OTPMailer,
};

// emailResetPasswordHandler
