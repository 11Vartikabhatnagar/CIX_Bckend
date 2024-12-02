/**
 * Admin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_admin",
  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "active",
    },
    email: {
      type: "string",
      columnType: "varchar(255)",
      isEmail: true,
      unique: true,
      required: true,
    },
    password: {
      type: "string",
      columnType: "varchar(255)",
    },
    fullname: {
      type: "string",
      columnType: "varchar(255)",
      required: true,
    },
    avatar: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    role: {
      type: "string",
      columnType: "varchar(255)",
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
      if (!valuesToSet.avatar || valuesToSet.avatar === "")
        valuesToSet.avatar = sails.config.globals.default_assets.avatar;
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },
  customToJSON: function () {
    return _.omit(this, ["password", "refresh_token"]);
  },
};
