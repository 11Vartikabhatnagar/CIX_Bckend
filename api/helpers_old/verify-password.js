const bcrypt = require("bcrypt");

async function verifyPassword(inputs, exits) {
  bcrypt.compare(inputs.password, inputs.hash, (err, res) => {
    if (err) throw err;
    else if (res) return exits.success(true);
    else return exits.success(false);
  });
}

module.exports = {
  friendlyName: "Password Verification",
  description: "A function to handle password verification using bcrypt",
  inputs: {
    hash: {
      type: "string",
      description: "hash which needs to be compared against password",
    },
    password: {
      type: "string",
      description: "password which needs to be verified",
    },
  },
  exits: {},

  fn: verifyPassword,
};
