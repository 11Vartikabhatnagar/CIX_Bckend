/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwt = require("jsonwebtoken");
const uid = require("uid");
const sgMail = require("@sendgrid/mail");
const MailEventsController = require("./MailEventsController");
const moment = require("moment");
const admin = require("../../firebase-config");
const fireStore = admin.firestore();

module.exports = {
  signUp: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "User created successfully",
        data: await Users.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  verifyEmailOTP: async (req, res) => {
    try {
      const temp = await Users.findOne({ id: req.body.slug.id });
      if (temp)
        if (temp.email_otp === req.body.data.email_otp) {
          res.send({
            status: true,
            msg: "Account activated!",
            data: await Users.update({ id: req.body.slug.id })
              .set({ email_verified: true })
              .fetch(),
          });
          // send pending approval email
          const userData = await Users.findOne({ id: req.body.slug.id })
            .populate("seeker")
            .populate("provider");
          const protocol = req.connection.encrypted ? "https" : "http";
          const baseUrl = protocol + "://" + req.headers.host;
          let emailParams = {
            email: userData.email,
            avatar: "",
            user_name: "",
          };
          if (userData.role_seeker) {
            emailParams.avatar = `${baseUrl + userData.seeker[0].avatar}`;
            emailParams.user_name = userData.seeker[0].fullname.split(" ")[0];
          } else if (userData.role_provider) {
            emailParams.avatar = `${baseUrl + userData.provider[0].avatar}`;
            emailParams.user_name = userData.provider[0].fullname.split(" ")[0];
          }
          // console.log(emailParams);
          MailEventsController.onAccountPendingApproval(emailParams);
        } else {
          res.send({
            status: false,
            msg: "Incorrect verification code",
            data: [],
          });
        }
      else
        res.send({
          status: false,
          msg: "User not found",
          data: [],
        });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await Users.findOne({ id: req.body.slug.id })
        .populate("seeker")
        .populate("provider");
      res.send(
        data
          ? { status: true, msg: "User retrieved", data: data }
          : { status: false, msg: "User not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Users.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      })
        .populate("seeker")
        .populate("provider");
      res.send(
        data.length > 0
          ? { status: true, msg: "Users retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Users.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "User retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Users.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "User updated", data: data }
          : { status: false, msg: "User not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await Users.destroyOne({ id: req.body.slug.id });
      res.send(
        data
          ? { status: true, msg: "User deleted successfully", data: data }
          : { status: false, msg: "User not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await Users.destroy({ id: req.body.slug.ids }).fetch();
      res.send(
        data.length > 0
          ? { status: true, msg: "Users deleted successfully", data: data }
          : { status: false, msg: "Users not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  login: async (req, res) => {
    try {
      const user = await Users.findOne({ email: req.body.data.email })
        .populate("seeker")
        .populate("provider");
      // console.log(user);
      if (!user) {
        res.send({
          status: false,
          msg: "Invalid Email",
          data: [],
        });
      } else if (user.email_verified != true) {
        res.send({
          status: false,
          msg: "Account not activated",
          data: [],
        });
      } else if (user.status === "pending") {
        res.send({
          status: false,
          msg: "Approval pending",
          data: [],
        });
      } else if (
        await sails.helpers.verifyPassword(
          user.password,
          req.body.data.password
        )
      ) {
        sails.log.info("password verified");
        jwt.sign(
          { id: user.id, email: user.email },
          sails.config.globals.ACCESS_TOKEN_SECRET,
          (err, token) => {
            if (err) throw err;
            res.send({
              status: true,
              msg: "logged in successfully",
              data: user,
              access_token: token,
            });
          }
        );
      } else {
        res.send({
          status: false,
          msg: "Invalid Password",
          data: [],
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  changePassword: async (req, res) => {
    try {
      const user = await Users.findOne({ id: req.body.data.id });
      if (
        await sails.helpers.verifyPassword(
          user.password,
          req.body.data.old_password
        )
      ) {
        res.send({
          status: true,
          msg: "Password Changed Successfully!",
          data: await Users.update({ id: req.body.data.id })
            .set({ password: req.body.data.new_password })
            .fetch(),
        });
      } else {
        res.send({
          status: false,
          msg: "invalid password",
          data: [],
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  resendVerificationCodeForActivation: async (req, res) => {
    try {
      const user = await Users.findOne({ id: req.body.slug.id });
      if (user) {
        const activationCode = uid(6);
        await Users.update({ id: user.id }).set({ email_otp: activationCode });
        await sails.helpers.emailOtpHandler({
          sendto: user.email,
          code: activationCode,
        });
        res.send({
          status: true,
          msg: `Verification code sent to ${user.email}`,
          data: [],
        });
      } else {
        res.send({
          status: false,
          msg: "User not found",
          data: [],
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  resetPasswordSendVerificationCode: async (req, res) => {
    try {
      const user = await Users.findOne({ email: req.body.data.email });
      if (user) {
        const resetCode = uid(6);
        await Users.update({ id: user.id }).set({
          password_reset_code: resetCode,
        });
        await sails.helpers.emailResetPasswordHandler({
          sendto: user.email,
          code: resetCode,
        });
        res.send({
          status: true,
          msg: `Verification code sent to ${user.email}`,
          data: [],
        });
      } else {
        res.send({
          status: false,
          msg: "Email not registered",
          data: [],
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  verifyResetCode: async (req, res) => {
    try {
      const verficationCode = req.body.data.verification_code;
      const user = await Users.findOne({ email: req.body.data.email });
      if (user && user.password_reset_code == verficationCode) {
        res.send({
          status: true,
          msg: `Code Verified`,
          data: [],
        });
      } else {
        res.send({
          status: false,
          msg: `Incorrect Verification Code`,
          data: [],
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const verficationCode = req.body.data.verification_code;
      const newPassword = req.body.data.new_password;
      const user = await Users.findOne({ email: req.body.data.email });
      if (user && user.password_reset_code == verficationCode) {
        res.send({
          status: true,
          msg: `Password changed successfully`,
          data: await Users.update({ id: user.id })
            .set({ password: newPassword })
            .fetch(),
        });
      } else {
        res.send({
          status: false,
          msg: `Incorrect Verification Code`,
          data: [],
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  submitContactForm: async (req, res) => {
    await sails.helpers
      .contactFormHandler({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        shortdesc: req.body.shortdesc,
        longdesc: req.body.longdesc,
      })
      .catch((err) => {
        res.send({
          status: false,
          msg: `Something went wrong please try again`,
          data: [],
        });
      });
    res.send({
      status: true,
      msg: `Contact form has been submitted successfully`,
      data: [],
    });
    sendQueryReceivedAknowledgement(
      await Users.findOne({ email: req.body.email })
        .populate("seeker")
        .populate("provider"),
      req
    );
  },

  testNotification: async (req, res) => {
    const emailData = {
      receiver: "thanigai@excrin.com",
      sender: "cix@forgeforward.in",
      templateName: "account_approved",
      dynamic_template_data: {
        user_name: "thanigai",
        user_avatar: "thanigai",
      },
    };
    await sails.helpers.sgMailer(emailData);
    res.send("notification sent");
  },
};

async function sendQueryReceivedAknowledgement(userData, req) {
  if (userData) {
    const protocol = req.connection.encrypted ? "https" : "http";
    const baseUrl = protocol + "://" + req.headers.host;
    const currentDate = moment().format("Do MMM,hh:mm");
    if (userData.role_seeker) {
      MailEventsController.onNewQuerySubmit({
        user_name: userData.seeker[0].fullname.split(" ")[0],
        email: userData.email,
        avatar: `${baseUrl + userData.seeker[0].avatar}`,
        query: req.body.shortdesc,
        submit_date: currentDate,
      });
    } else {
      MailEventsController.onNewQuerySubmit({
        user_name: userData.provider[0].fullname.split(" ")[0],
        email: userData.email,
        avatar: `${baseUrl + userData.provider[0].avatar}`,
        query: req.body.shortdesc,
        submit_date: currentDate,
      });
    }
  }
}
