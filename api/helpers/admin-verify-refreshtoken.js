const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "Verify refresh token",
  description: "",
  inputs: {
    refreshToken: {
      type: "string",
      description: "Refresh token",
    },
  },
  exits: {},
  fn: async function (inputs) {
    return new Promise(async (resolve, reject) => {
      const token = await Admin.findOne({
        select: ["refresh_token"],
        where: { refresh_token: inputs.refreshToken },
      });
      const secret = sails.config.globals.REFRESH_TOKEN_SECRET;
      if (!token) return reject(new Error("REFRESH_TOKEN_NOT_FOUND"));
      jwt.verify(token.refresh_token, secret, (err, payload) => {
        if (err) return reject(err);
        resolve(payload);
      });
    });
  },
};
