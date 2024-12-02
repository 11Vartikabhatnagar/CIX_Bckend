/**
 * Seekers.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_seekers",

  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "pending",
    },
    slug: {
      type: "string",
      columnType: "varchar(255)",
      unique: true,
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
    department: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    designation: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    phone_code: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    phone: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    landline_num: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    location: {
      collection: "locations",
      via: "frg_seeker_id",
      through: "locationsseekers",
    },
    frg_user_id: {
      model: "users",
    },
    frg_smart_city_id: {
      model: "smartcities",
    },
    challenge_sectors: {
      collection: "challengesectors",
      via: "frg_seeker_id",
      through: "challengesectorsSeekers",
    },
    anchors: {
      collection: "anchors",
      via: "frg_seeker_id",
    },
    eoi: {
      collection: "eoi",
      via: "frg_seeker_id",
    },
  },

  beforeCreate: async (valuesToSet, proceed) => {
    try {
      if (!valuesToSet.avatar || valuesToSet.avatar === "")
        valuesToSet.avatar = sails.config.globals.default_assets.avatar;
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },
};
