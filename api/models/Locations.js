/**
 * Locations.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_locations",
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
      unique: true,
    },
    city: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    state: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    pincode: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    provider: {
      collection: "providers",
      via: "frg_location_id",
      through: "locationsproviders",
    },
    seeker: {
      collection: "seekers",
      via: "frg_location_id",
      through: "locationsseekers",
    },
    // eoi: {
    //   collection: "eoi",
    //   via: "frg_location_id",
    // },
    // applications:{
    //   collection:'applications',
    //   via:'frg_location_id'
    // }
  },
};
