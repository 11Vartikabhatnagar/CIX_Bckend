/**
 * Proposal.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_proposals",
  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "active",
    },
    customisation_details: {
      type: "string",
      columnType: "text",
    },
    outcomes: {
      type: "string",
      columnType: "text",
    },
    time_of_pilot: {
      type: "json",
    },
    time_of_commission: {
      type: "json",
    },
    implementation_monitoring_timeline: {
      type: "json",
    },
    budget: {
      type: "json",
    },
    track_record: {
      type: "string",
      columnType: "text",
    },
    reports_of_past_pilot: {
      type: "json",
    },
    team_size: {
      type: "string",
      columnType: "varchar(255)",
    },
    team_member: {
      type: "json",
    },
    dependencies: {
      type: "string",
      columnType: "text",
    },
    additional_details: {
      type: "json",
    },
    proposal_stage: {
      type: "string",
      columnType: "varchar(255)",
      isIn: ["New", "Pilot Ready", "Pre-Pilot"],
      defaultsTo: "New",
    },
    pilot_status: {
      type: "string",
      columnType: "varchar(255)",
      isIn: ["Completed", "Ongoing", "Yet to Start"],
      defaultsTo: "Yet to Start",
    },
    pilot_order: {
      type: "json",
    },
    pilot_report: {
      type: "json",
    },
    frg_provider_id: {
      model: "providers",
    },
    frg_eoi_id: {
      model: "eoi",
    },
    frg_anchor_id: {
      model: "anchors",
    },
  },
};
