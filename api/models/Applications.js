/**
 * Applications.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_applications",
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
    },
    market_domain: {
      type: "json",
    },
    solution_brief: {
      type: "string",
      columnType: "text",
    },
    value_proposition: {
      type: "string",
      columnType: "text",
    },
    tangible_benifits: {
      type: "string",
      columnType: "text",
    },
    solution_advantages: {
      type: "string",
      columnType: "text",
    },
    solution_readiness: {
      type: "string",
      columnType: "text",
    },
    track_record: {
      type: "string",
      columnType: "text",
    },
    implementation_time: {
      type: "json",
    },
    ip_details: {
      type: "json",
    },
    experts_involved: {
      type: "string",
      columnType: "text",
    },
    other_details: {
      type: "string",
      columnType: "text",
    },
    images: {
      type: "json",
    },
    video_link: {
      type: "string",
      columnType: "varchar(255)",
    },
    application_status: {
      type: "string",
      columnType: "varchar(255)",
      isIn: ["Shortlist", "Onhold", "Reject", "New"],
      defaultsTo: "New",
    },
    eoi_received:{
      type: "boolean",
      defaultsTo: false,
    },
    frg_provider_id: {
      model: "providers",
    },
    frg_anchor_id: {
      model: "anchors",
    },
    frg_challenge_id: {
      model: "challenges",
    },
    frg_challenge_sector_id: {
      model: "challengesectors",
    },
    eoi: {
      collection: "eoi",
      via: "frg_application_id",
    },
  },
};
