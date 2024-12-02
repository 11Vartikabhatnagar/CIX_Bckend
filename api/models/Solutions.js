/**
 * Solutions.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_solutions",
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
    stage: {
      type: "string",
      columnType: "varchar(255)",
      isIn: ["Pre Pilot", "Pilot", "Pilot Certified"],
    },
    frg_provider_id: {
      model: "providers",
    },
    frg_anchor_id: {
      model: "anchors",
    },
    challenge_sectors: {
      collection: "challengesectors",
      via: "frg_solution_id",
      through: "solutionschallengesectors",
    },
    challenges: {
      collection: "challenges",
      via: "frg_solution_id",
      through: "solutionschallenges",
    },
    smart_cities: {
      collection: "smartcities",
      via: "frg_solution_id",
      through: "solutionssmartcities",
    },
    // applications: {
    //   collection: 'applications',
    //   via: 'frg_solution_id'
    // }
  },
};
