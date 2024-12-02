/**
 * ChallengeSectors.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_challenge_sectors",

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
    },
    avatar: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    providers: {
      collection: "providers",
      via: "frg_challenge_sector_id",
      through: "challengesectorsproviders",
    },
    seekers: {
      collection: "seekers",
      via: "frg_challenge_sector_id",
      through: "challengesectorsSeekers",
    },
    smart_cities: {
      collection: "smartcities",
      via: "frg_challenge_sector_id",
      through: "smartcitychallengesector",
    },
    challenges: {
      collection: "challenges",
      via: "frg_challenge_sector_id",
    },
    applications: {
      collection: "applications",
      via: "frg_challenge_sector_id",
    },
    solutions: {
      collection: "solutions",
      via: "frg_challenge_sector_id",
      through: "solutionschallengesectors",
    },
  },
};
