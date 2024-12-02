/**
 * ChallengesectorsSeekers.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'frg_challenge_sectors_seekers',

  attributes: {
    frg_challenge_sector_id: {
      model: 'challengesectors'
    },
    frg_seeker_id: {
      model: 'seekers'
    },
  },

};
