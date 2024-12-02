/**
 * Challenges.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_challenges",

  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "pending",
    },
    name: {
      type: "string",
      columnType: "varchar(255)",
      required: true,
      unique: true,
    },
    frg_challenge_sector_id: {
      model: "challengesectors",
    },
    uns_proposal: {
      type: "boolean",
      defaultsTo: false,
    },
    anchors: {
      collection: "anchors",
      via: "frg_challenge_id",
    },
    applications: {
      collection: "applications",
      via: "frg_challenge_id",
    },
    solutions: {
      collection: "solutions",
      via: "frg_challenge_id",
      through: "solutionschallenges",
    },
    smart_city: {
      collection: "smartcities",
      via: "frg_challenge_id",
      through: "challengesmartcity",
    },
  },
};
