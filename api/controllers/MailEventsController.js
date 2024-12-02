/**
 * MailEventsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const emailSender = "cix@forgeforward.in";

module.exports = {
  onNewSignup: (data) => {},

  onForgotPassword: async (data) => {
    const emailData = {
      receiver: data.frg_user_id.email,
      sender: emailSender,
      templateName: "password_reset",
      dynamic_template_data: {
        name: data.fullname,
        reset_code: data.frg_user_id.password_reset_code,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  emailOtp: async (data) => {
    const emailData = {
      receiver: data.frg_user_id.email,
      sender: emailSender,
      templateName: "account_verification",
      dynamic_template_data: {
        name: data.fullname,
        verification_code: data.frg_user_id.email_otp,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },
  
  onNewChallengeCreation: async (data) => {
    const emailData = {
      receiver: "cix@forgeforward.in",
      sender: emailSender,
      templateName: "new_challenge_under_sector",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
        challenge_name: data.challenge_name,
        challenge_sector: data.challenge_sector,
        challenge_url: data.challenge_url,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  onChallengeAnchoredByOtherCity: async (data) => {
    const emailData = {
      receiver: "cix@forgeforward.in",
      sender: emailSender,
      templateName: "challenge_anchored_by_other_city",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
        anchored_by: data.anchored_by,
        anchored_for: data.anchored_for,
        challenge_name: data.challenge_name,
        posted_time: data.posted_time,
        anchor_url: data.anchor_url,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  onNewAnchorUnderSector: async (data) => {
    const emailData = {
      receiver: "arun.s@forgeforward.in",
      sender: emailSender,
      templateName: "new_anchor_under_sector",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
        anchored_by: data.anchored_by,
        anchored_for: data.anchored_for,
        challenge_name: data.challenge_name,
        challenge_sector: data.challenge_sector,
        posted_time: data.posted_time,
        anchor_url: data.anchor_url,
        create_solution_url: data.create_solution_url,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  onAnchoredUnderProviderSolution: async (data) => {
    const emailData = {
      receiver: "arun.s@forgeforward.in",
      sender: emailSender,
      templateName: "new_anchor_under_solution",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
        anchored_by: data.anchored_by,
        anchored_for: data.anchored_for,
        challenge_name: data.challenge_name,
        posted_time: data.posted_time,
        anchor_url: data.anchor_url,
      },
    };
    // console.log(emailData);
    await sails.helpers.sgMailer(emailData);
  },

  onAnchorClosed: async (data) => {
    const emailData = {
      receiver: "cix@forgeforward.in",
      sender: emailSender,
      templateName: "closed_anchor_under_same_challenge",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
        anchored_by: data.anchored_by,
        anchored_for: data.anchored_for,
        challenge_name: data.challenge_name,
        closed_time: data.closed_time,
        anchor_url: data.anchor_url,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  onNewSolutionCatalogueUnderSector: async (data) => {
    const emailData = {
      receiver: "cix@forgeforward.in",
      sender: emailSender,
      templateName: "new_solution_under_sector",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
        company_name: data.company_name,
        challenge_sector: data.challenge_sector,
        solution_name: data.solution_name,
        posted_date: data.posted_date,
        solution_url: data.solution_url,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  onNewSolutionCatalogueUnderChallenge: async (data) => {
    const emailData = {
      receiver: "cix@forgeforward.in",
      sender: emailSender,
      templateName: "solution_added_for_challenge",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
        company_name: data.company_name,
        challenge_name: data.challenge_name,
        challenge_sector: data.challenge_sector,
        solution_name: data.solution_name,
        posted_date: data.posted_date,
        challenge_url: data.challenge_url,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  onNewQuerySubmit: async (data) => {
    const emailData = {
      receiver: "cix@forgeforward.in",
      sender: emailSender,
      templateName: "query_submit",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
        query: data.query,
        submit_date: data.submit_date,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  onAccountApproval: async (data) => {
    const emailData = {
      receiver: "cix@forgeforward.in",
      sender: emailSender,
      templateName: "account_approved",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },

  onAccountPendingApproval: async (data) => {
    const emailData = {
      receiver: "cix@forgeforward.in",
      sender: emailSender,
      templateName: "pending_approval",
      dynamic_template_data: {
        user_name: data.user_name,
        user_avatar: data.avatar,
      },
    };
    await sails.helpers.sgMailer(emailData);
  },
};
