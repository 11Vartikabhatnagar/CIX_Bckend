const jwt = require("jsonwebtoken");

async function createRefreshToken(inputs) {
  return new Promise((resolve, reject) => {
    const secret = sails.config.globals.REFRESH_TOKEN_SECRET;
    const options = { expiresIn: "7d" };
    jwt.sign(inputs.payload, secret, options, (err, token) => {
      if (err) throw err;
      resolve(token);
    });
  });
}

module.exports = {
  friendlyName: "Sign refresh token",
  description: "",
  inputs: {
    payload: {
      type: "ref",
      description: "user details",
    },
  },
  exits: {},
  fn: createRefreshToken,
};
