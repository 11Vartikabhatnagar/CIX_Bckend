/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "admin created successfully",
        data: await Admin.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
  select: async (req, res) => {
    try {
      const data = await Admin.findOne({ id: req.body.slug.id });
      res.send(
        data
          ? { status: true, msg: "admin retrieved", data: data }
          : { status: false, msg: "admin not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  countService: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Counts received",
        data: {
          admin_approved: await Seekers.count({
            where: {
              status: "active",
            },
          }),
          admin_pending: await Seekers.count({
            where: {
              status: "pending",
            },
          }),
          innovator_approved: await Providers.count({
            where: {
              status: "active",
            },
          }),
          innovator_pending: await Providers.count({
            where: {
              status: "pending",
            },
          }),
          challenge_active: await Challenges.count({
            where: {
              status: "active",
            },
          }),
          anchor_active: await Anchors.count({
            where: {
              status: "active",
            },
          }),
          challenge_pending: await Challenges.count({
            where: {
              status: "pending",
            },
          }),
          anchor_pending: await Anchors.count({
            where: {
              status: "pending",
              challenge_status: "Awaiting Approval"
            },
          }),
          sector_active: await ChallengeSectors.count({
            where: {
              status: "active",
            },
          }),
          solution_active: await Solutions.count({
            where: {
              status: "active",
            },
          }),
          cities_active: await SmartCities.count({
            where: {
              status: "active",
            },
          }),
          archive: {
            city: await SmartCities.count({
              where: {
                status: "archive",
              },
            }),
            challenge: await Challenges.count({
              where: {
                status: "archive",
              },
            }),
            sector: await ChallengeSectors.count({
              where: {
                status: "archive",
              },
            }),
            anchor: await Anchors.count({
              where: {
                status: "archive",
              },
            }),
            solution: await Solutions.count({
              where: {
                status: "archive",
              },
            }),
          },
        },
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
