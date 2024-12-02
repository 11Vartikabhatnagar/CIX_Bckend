/**
 * SmartCityChallengeSector.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_smart_city_challenge_sector",
  attributes: {
    frg_challenge_sector_id: {
      model: "challengesectors",
    },
    frg_smart_city_id: {
      model: "smartcities",
    },
  },
};
