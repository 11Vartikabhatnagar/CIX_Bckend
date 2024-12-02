const sgMail = require("@sendgrid/mail");
const apiKey = sails.config.globals.SG_API_TOKEN;

async function sgMailer(inputs) {
  sgMail.setApiKey(apiKey);
  const mailTemplates = {
    new_challenge_under_sector: "d-4058b182c99a4d6cb55eae386d5a88a3",
    new_solution_under_sector: "d-ab1ecfc4e2ce4475a8b0deab369f2585",
    solution_added_for_challenge: "d-3dd881798eb84bf4922f644ad35937e6",
    query_submit: "d-b1652912abb04d399e313fbc25f31e9f",
    challenge_anchored_by_other_city: "d-9577a8f8ecf34ab285e0622586b9a4d5",
    new_anchor_under_sector: "d-2045851621f74a27b51a0eea4cc6aca3",
    new_anchor_under_solution: "d-8e15dcbf60f84559ae8f32db267d12e2",
    closed_anchor_under_same_challenge: "d-67b568fda1a24679a8e92ca515ec5b28",
    account_approved: "d-a2151b62a3db48e6aee9f5f8c56f100e",
    pending_approval: "d-dc389c1fdc3a430b806a45ff729b6615",
  };
  const mailBody = {
    to: inputs.data.receiver,
    from: inputs.data.sender,
    templateId: mailTemplates[inputs.data.templateName],
    dynamic_template_data: inputs.data.dynamic_template_data,
    // mail_settings: {
    //   sandbox_mode: {
    //     enable: true,
    //   },
    // },
    hideWarnings: true,
  };
  sgMail.send(mailBody, (err, result) => {
    if (err) throw err;
    sails.log.info(
      `${
        inputs.data.templateName + mailTemplates[inputs.data.templateName]
      } email sent`
    );
  });
}

module.exports = {
  friendlyName: "Sg mailer",
  description: "send grid mailer function",
  inputs: {
    data: {
      type: "ref",
      description: "email body parameters",
    },
  },
  exits: {},
  fn: sgMailer,
};

// With default usage:
// await sails.helpers.sgMailer(…, …);
