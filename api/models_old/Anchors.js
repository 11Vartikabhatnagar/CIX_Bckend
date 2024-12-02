/**
 * Anchors.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_anchors",
  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "pending",
    },
    challenge_summary: {
      type: "string",
      columnType: "varchar(255)",
      required: true,
    },
    challenge_scenario: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    target_beneficiaries: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    functional_requirements: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    functional_operational_capabilities: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    deployment_constraints: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    tangible_outcomes_benefits: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    gaps_current_solution: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    other_requirements_remarks: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    info_links: {
      type: "json",
    },
    challenge_status: {
      type: "string",
      columnType: "varchar(255)",
      isIn: [
        "Awaiting Approval",
        "Accepting Solutions",
        "Reviewing Solutions",
        "Co-Creation",
        "Awaiting Proposal",
        "Reviewing Pilots",
        "Pilot",
        "Closed",
      ],
      defaultsTo: "Awaiting Approval",
      allowNull: true,
    },
    start_date: {
      type: "ref",
      columnType: "date",
    },
    end_date: {
      type: "ref",
      columnType: "date",
    },
    frg_seeker_id: {
      model: "seekers",
    },
    frg_challenge_id: {
      model: "challenges",
    },
    solutions: {
      collection: "solutions",
      via: "frg_anchor_id",
    },
    eoi: {
      collection: "eoi",
      via: "frg_anchor_id",
    },
    applications: {
      collection: "applications",
      via: "frg_anchor_id",
    },
    proposals: {
      collection: "proposal",
      via: "frg_anchor_id",
    },
    smart_cities: {
      collection: "smartcities",
      via: "frg_anchor_id",
      through: "anchorssmartcities",
    },
  },
};
