/**
 * AnchorsSmartCities.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_anchors_smart_cities",
  attributes: {
    frg_anchor_id: {
      model: "anchors",
    },
    frg_smart_city_id: {
      model: "smartcities",
    },
  },
};
