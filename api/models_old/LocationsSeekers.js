/**
 * LocationsSeekers.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'frg_locations_seekers',

  attributes: {
    frg_location_id: {
      model: 'locations'
    },
    frg_seeker_id: {
      model: 'seekers'
    },
  },

};


