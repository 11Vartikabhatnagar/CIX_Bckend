const jwt = require("jsonwebtoken");

function createAccessToken(inputs) {
  return new Promise((resolve, reject) => {
    const secret = sails.config.globals.ACCESS_TOKEN_SECRET;
    const options = { expiresIn: "1h" };
    jwt.sign(inputs.payload, secret, options, (err, token) => {
      if (err) throw err;
      resolve(token);
    });
  });
}

module.exports = {
  friendlyName: "Sign access token",
  description: "",
  inputs: {
    payload: {
      type: "ref",
      description: "user details",
    },
  },
  exits: {},
  fn: createAccessToken,
};
