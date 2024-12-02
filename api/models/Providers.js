/**
 * Providers.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "frg_providers",

  attributes: {
    status: {
      type: "string",
      columnType: "varchar(255)",
      defaultsTo: "pending",
    },
    role: {
      type: "string",
      columnType: "varchar(255)",
      required: true,
      isIn: ["startup", "enterprise", "individual"],
    },
    slug: {
      type: "string",
      columnType: "varchar(255)",
      unique: true,
    },
    fullname: {
      type: "string",
      columnType: "varchar(255)",
      required: true,
    },
    avatar: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    location: {
      collection: "locations",
      via: "frg_provider_id",
      through: "locationsproviders",
    },
    dipp_number: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    company_logo: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    achievements: {
      type: "json",
    },
    // start up fields
    startup_company_name: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    startup_company_url: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    startup_company_phone_code: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    startup_company_phone: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    startup_company_brief: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    startup_incorporation_years: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    startup_founders: {
      type: "json",
    },
    startup_teamsize: {
      type: "number",
    },
    startup_technical_expertises: {
      type: "json",
    },
    startup_market_expertises: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    startup_affiliates: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    // individual fields
    indv_expertises: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    indv_website_url: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    indv_expertise_years: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    indv_affiliates: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    indv_tech_creds: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    // Enterprise fields
    enterprise_company_name: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    enterprise_company_url: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    enterprise_company_phone_code: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    enterprise_company_phone: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    enterprise_company_brief: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    enterprise_incorporation_year: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    enterprise_founders: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    enterprise_company_size: {
      type: "number",
    },
    enterprise_annual_revenue: {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    enterprise_expertises: {
      type: "string",
      columnType: "text",
      allowNull: true,
    },
    frg_user_id: {
      model: "users",
    },
    frg_smart_city_id: {
      model: "smartcities",
    },
    challenge_sectors: {
      collection: "challengesectors",
      via: "frg_provider_id",
      through: "challengesectorsproviders",
    },
    solutions: {
      collection: "solutions",
      via: "frg_provider_id",
    },
    applications: {
      collection: "applications",
      via: "frg_provider_id",
    },
    proposals: {
      collection: "proposal",
      via: "frg_provider_id",
    },
  },

  beforeCreate: async (valuesToSet, proceed) => {
    try {
      if (!valuesToSet.avatar || valuesToSet.avatar === "")
        valuesToSet.avatar = sails.config.globals.default_assets.avatar;
      return proceed();
    } catch (err) {
      return proceed(err);
    }
  },
};
