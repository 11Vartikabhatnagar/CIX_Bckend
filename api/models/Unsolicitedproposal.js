/**
 * Unsolicitedproposal.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_unsolicited_propsal",
  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "inactive",
    },
    frg_challenge_id:{
      model: 'challenges'
    },
    frg_challenge_sector_id: {
      model: 'challengesectors'
    },
    frg_provider_id:{
      model:"providers"
    },
    frg_smart_city_id:{
      model:"smartcities"
    },
    frg_anchor_id:{
      model:"anchors"
    },
    sol_sub_status:{
      type: 'boolean',
      defaultsTo: false
    },
    uns_files:{
      type: "json"
    }

  },

};

