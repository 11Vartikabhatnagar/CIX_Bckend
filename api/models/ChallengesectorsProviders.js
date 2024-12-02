/**
 * ChallengesectorsProviders.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'frg_challenge_sectors_providers',

  attributes: {
    frg_challenge_sector_id: {
      model: 'challengesectors'
    },
    frg_provider_id: {
      model: 'providers'
    },
  },

};

