/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const uid = require("uid");

module.exports = {
  tableName: "frg_users",

  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "pending",
    },
    email: {
      type: "string",
      columnType: "varchar(255)",
      isEmail: true,
      unique: true,
      required: true,
    },
    mobile_code: {
      type: "string",
      columnType: "varchar(255)",
      required: true,
    },
    mobile: {
      type: "string",
      columnType: "varchar(255)",
      unique: true,
      required: true,
    },
    email_otp: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    sms_otp: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    email_verified: {
      type: "boolean",
      defaultsTo: true,
    },
    sms_verified: {
      type: "boolean",
      defaultsTo: false,
    },
    password: {
      type: "string",
      columnType: "varchar(255)",
    },
    password_reset_code: {
      type: "string",
      columnType: "varchar(255)",
    },
    role_seeker: {
      type: "boolean",
      defaultsTo: false,
    },
    role_provider: {
      type: "boolean",
      defaultsTo: false,
    },
    role_cwg: {
      type: "boolean",
      defaultsTo: false,
    },
    provider: {
      collection: "providers",
      via: "frg_user_id",
    },
    seeker: {
      collection: "seekers",
      via: "frg_user_id",
    },
    social_signup_via: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "",
      allowNull: true,
    },
    refresh_token: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
  },

  beforeCreate: async (valuesToSet, proceed) => {
    try {
      valuesToSet.password = await sails.helpers.hashPassword(
        valuesToSet.password
      );
      valuesToSet.email_otp = uid(6);
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },

  afterCreate: async (record, proceed) => {
    try {
    //   await sails.helpers.emailOtpHandler({
    //     sendto: record.email,
    //     code: record.email_otp,
    //   });
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },

  beforeUpdate: async (valuesToSet, proceed) => {
    try {
      if (valuesToSet.password)
        valuesToSet.password = await sails.helpers.hashPassword(
          valuesToSet.password
        );
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },

  customToJSON: function () {
    return _.omit(this, ["password", "email_otp", "sms_otp", "refresh_token"]);
  },
};
