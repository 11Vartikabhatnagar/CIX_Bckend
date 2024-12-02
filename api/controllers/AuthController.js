/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require("moment");

module.exports = {
  login: async (req, res) => {
    try {
      const user = await Users.findOne({ email: req.body.data.email })
        .populate("seeker")
        .populate("provider");
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
        const accessToken = await sails.helpers.signAccessToken({
          id: user.id,
          email: user.email,
        });
        const refreshToken = await sails.helpers.signRefreshToken({
          id: user.id,
          email: user.email,
        });
        sails.log.info("password verified");
        res.send({
          status: true,
          msg: "logged in successfully",
          data: user,
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // setting the refresh token in Db
        await Users.updateOne({
          where: { id: user.id },
        }).set({ refresh_token: refreshToken });
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

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.body.refresh_token;
      if (!refreshToken) {
        res.badRequest({
          status: false,
          msg: "Invalid request format",
        });
      }
      const decoded = await sails.helpers.verifyRefreshToken(refreshToken);
      const newAccessToken = await sails.helpers.signAccessToken({
        id: decoded.id,
        email: decoded.email,
      });
      const newRefreshToken = await sails.helpers.signRefreshToken({
        id: decoded.id,
        email: decoded.email,
      });
      res.send({
        status: true,
        msg: "new pair of tokens created",
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });
      // replacing the new refresh token in DB
      await Users.updateOne({
        where: { id: decoded.id },
      }).set({ refresh_token: newRefreshToken });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  adminLogin: async (req, res) => {
    try {
      const user = await Admin.findOne({ email: req.body.data.email });
      if (!user) {
        res.send({
          status: false,
          msg: "Invalid Email",
          data: [],
        });
      } else if (
        await sails.helpers.verifyPassword(
          user.password,
          req.body.data.password
        )
      ) {
        const accessToken = await sails.helpers.signAccessToken({
          id: user.id,
          email: user.email,
        });
        const refreshToken = await sails.helpers.signRefreshToken({
          id: user.id,
          email: user.email,
        });
        sails.log.info("password verified");
        res.send({
          status: true,
          msg: "logged in successfully",
          data: user,
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // setting the refresh token in Db
        await Admin.updateOne({
          where: { id: user.id },
        }).set({ refresh_token: refreshToken });
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

  refreshTokenAdmin: async (req, res) => {
    try {
      const refreshToken = req.body.refresh_token;
      if (!refreshToken) {
        res.badRequest({
          status: false,
          msg: "Invalid request format",
        });
      }
      const decoded = await sails.helpers.adminVerifyRefreshtoken(refreshToken);
      const newAccessToken = await sails.helpers.signAccessToken({
        id: decoded.id,
        email: decoded.email,
      });
      const newRefreshToken = await sails.helpers.signRefreshToken({
        id: decoded.id,
        email: decoded.email,
      });
      res.send({
        status: true,
        msg: "new pair of tokens created",
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });
      // replacing the new refresh token in DB
      await Admin.updateOne({
        where: { id: decoded.id },
      }).set({ refresh_token: newRefreshToken });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  authCheck: async (req, res) => {
    res.send({
      status: true,
      msg: "route accessed",
    });
  },
};
