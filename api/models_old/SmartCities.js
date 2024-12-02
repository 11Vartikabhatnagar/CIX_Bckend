/**
 * SmartCities.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_smart_cities",

  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "active",
    },
    name: {
      type: "string",
      columnType: "varchar(255)",
      required: true,
      unique: true,
    },
    avatar: {
      type: "string",
      columnType: "varchar(255)",
    },
    city_logo: {
      type: "string",
      columnType: "varchar(255)",
    },
    ceo_name: {
      type: "string",
      columnType: "varchar(255)",
    },
    ceo_email: {
      type: "string",
      columnType: "varchar(255)",
    },
    ceo_avatar: {
      type: "string",
      columnType: "varchar(255)",
    },
    vision: {
      type: "string",
      columnType: "text",
    },
    score: {
      type: "string",
      columnType: "varchar(255)",
    },
    budget: {
      type: "string",
      columnType: "varchar(255)",
    },
    city_area: {
      type: "string",
      columnType: "varchar(255)",
    },
    city_map: {
      type: "string",
      columnType: "varchar(255)",
    },
    city_demographics: {
      type: "string",
      columnType: "varchar(255)",
    },
    website: {
      type: "string",
      columnType: "text",
    },
    email: {
      type: "json",
    },
    mobile: {
      type: "json",
    },
    data_sheet: {
      type: "string",
      columnType: "text",
    },
    implemented_solutions: {
      type: "json",
    },
    achievements: {
      type: "json",
    },
    gallery: {
      type: "json",
    },
    social_media: {
      type: "json",
    },
    seekers: {
      collection: "seekers",
      via: "frg_smart_city_id",
    },
    providers: {
      collection: "providers",
      via: "frg_smart_city_id",
    },
    anchors: {
      collection: "anchors",
      via: "frg_smart_city_id",
      through: "anchorssmartcities",
    },
    solutions: {
      collection: "solutions",
      via: "frg_smart_city_id",
      through: "solutionssmartcities",
    },
    challenge_sectors: {
      collection: "challengesectors",
      via: "frg_smart_city_id",
      through: "smartCitychallengesector",
    },
    challenges: {
      collection: "challenges",
      via: "frg_smart_city_id",
      through: "challengesmartcity",
    },
  },

  beforeCreate: async (valuesToSet, proceed) => {
    try {
      if (!valuesToSet.avatar || valuesToSet.avatar === "") {
        valuesToSet.avatar = sails.config.globals.default_assets.avatar;
      }
      if (!valuesToSet.ceo_avatar || valuesToSet.ceo_avatar === "") {
        valuesToSet.ceo_avatar =
          sails.config.globals.default_assets.avatar;
      }
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },
};
