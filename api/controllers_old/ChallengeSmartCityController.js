/**
 * ChallengeSmartCityController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Challenge Smart city association created",
        data: await ChallengeSmartCity.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await ChallengeSmartCity.findOne({ id: req.body.slug.id });
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Smart city association retrieved",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Smart city association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await ChallengeSmartCity.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      });
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Challenge Smart city association retrieved",
              data: data,
            }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await ChallengeSmartCity.count({
        where: query.condition,
      });
      res.send({
        status: true,
        msg: "Challenge Smart city association count retrieved",
        data: data,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await ChallengeSmartCity.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Smart city association updated",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Smart city association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await ChallengeSmartCity.destroyOne({
        id: req.body.slug.id,
      });
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Smart city association deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Smart city association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await ChallengeSmartCity.destroy({
        id: req.body.slug.ids.length > 0 ? req.body.slug.ids:[0],
      }).fetch();
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Challenge Smart city associations deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Smart city association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
