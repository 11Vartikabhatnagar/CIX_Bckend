/**
 * SolutionsChallengeSectors.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'frg_solutions_challenge_sectors',
  attributes: {
    frg_solution_id:{
      model:"solutions"
    },
    frg_challenge_sector_id:{
      model:"challengesectors"
    },
  },

};

