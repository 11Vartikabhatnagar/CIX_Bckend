/**
 * EOI.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_eoi",

  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "active",
    },
    goals_of_pilot: {
      type: "string",
      columnType: "text",
    },
    expected_outcomes: {
      type: "string",
      columnType: "text",
    },
    deployment_details: {
      type: "string",
      columnType: "text",
    },
    deployment_time: {
      type: "json",
    },
    budget_limit: {
      type: "string",
      columnType: "varchar(255)",
    },
    deployment_constraints: {
      type: "string",
      columnType: "text",
    },
    proposal_received: {
      type: "boolean",
      defaultsTo: false,
    },
    frg_seeker_id: {
      model: "seekers",
    },
    frg_anchor_id: {
      model: "anchors",
    },
    frg_application_id: {
      model: "applications",
    },
    proposals: {
      collection: "proposal",
      via: "frg_eoi_id",
    },
  },
};
