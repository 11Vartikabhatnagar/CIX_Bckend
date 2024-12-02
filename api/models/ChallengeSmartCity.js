/**
 * ChallengeSmartCity.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'frg_challenge_smartcity',
  attributes: {
    frg_challenge_id: {
      model: 'challenges'
    },
    frg_smart_city_id: {
      model: 'smartcities'
    },
    uns_proposal: {
      type: "boolean",
      defaultsTo: false,
    }
  },

};

