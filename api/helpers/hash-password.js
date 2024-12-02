const bcrypt = require("bcryptjs");
const saltRounds = 10;

async function passwordHash(inputs, exits) {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(inputs.password, salt, (err, hash) => {
      if (err) throw err;
      return exits.success(hash);
    });
  });
}

module.exports = {
  friendlyName: "Password Hash",
  description: "A function to handle password hashing using bcrypt",
  inputs: {
    password: {
      type: "ref",
      description: "password which needs to be hashed",
    },
  },
  exits: {},
  fn: passwordHash,
};

