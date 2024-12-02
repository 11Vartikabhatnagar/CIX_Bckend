/**
 * ChallengesectorsProvidersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Challenge Sector Provider association created",
        data: await ChallengesectorsProviders.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await ChallengesectorsProviders.findOne({
        id: req.body.slug.id,
      });
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Sector Provider association retrieved",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Sector Provider association not found",
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
      const data = await ChallengesectorsProviders.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      });
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Challenege Sector Provider association retrieved",
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
      const data = await ChallengesectorsProviders.count({
        where: query.condition,
      });
      res.send({
        status: true,
        msg: "Challenge Sector Provider association count retrieved",
        data: data,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await ChallengesectorsProviders.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Sector Provider association updated",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Sector Provider association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await ChallengesectorsProviders.destroyOne({
        id: req.body.slug.id,
      });
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Sector Provider association deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Sector Provider association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await ChallengesectorsProviders.destroy({
        id: req.body.slug.ids,
      }).fetch();
      res.send(
        data.length > 0
          ? {
              status: true,
              msg:
                "Challenge Sector Provider associations deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Sector Provider association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
  create_mul: async (req, res) => {
    var body = req.body;
    var res_arr = [];
    _.each(body, async (itm, idx) => {
      try {
        var data = await ChallengesectorsProviders.create(itm).fetch();
        res_arr.push(data);
        if (res_arr.length == body.length) {
          res.send({
            status: true,
            msg: "Challenge Sector providers association created",
            data: res_arr,
          });
        }
      } catch (error) {
        await sails.helpers.errorHandler(res, error);
      }
    });
  },
};
