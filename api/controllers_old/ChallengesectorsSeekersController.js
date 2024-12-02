/**
 * ChallengesectorsSeekersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Challenge Sector Seekers association created",
        data: await ChallengesectorsSeekers.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await ChallengesectorsSeekers.findOne({
        id: req.body.slug.id,
      });
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Sector Seekers association retrieved",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Sector Seekers association not found",
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
      const data = await ChallengesectorsSeekers.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      });
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Challenge Sectors Seekers association retrieved",
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
      const data = await ChallengesectorsSeekers.count({
        where: query.condition,
      });
      res.send({
        status: true,
        msg: "Challenge Sector Seekers association count retrieved",
        data: data,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await ChallengesectorsSeekers.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Sector Seekers association updated",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Sector Seekers association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await ChallengesectorsSeekers.destroyOne({
        id: req.body.slug.id,
      });
      res.send(
        data
          ? {
              status: true,
              msg: "Challenge Sector Seekers association deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Sector Seekers association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await ChallengesectorsSeekers.destroy({
        id: req.body.slug.ids,
      }).fetch();
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Challenge Sector Seekers associations deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Challenge Sector Seekers association not found",
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
        var data = await ChallengesectorsSeekers.create(itm).fetch();
        res_arr.push(data);
        if (res_arr.length == body.length) {
          res.send({
            status: true,
            msg: "Challenge Sector Seekers association created",
            data: res_arr,
          });
        }
      } catch (error) {
        await sails.helpers.errorHandler(res, error);
      }
    });
  },
};
