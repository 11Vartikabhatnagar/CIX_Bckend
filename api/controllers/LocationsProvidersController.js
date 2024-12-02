/**
 * LocationsProvidersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Location Provider association created",
        data: await LocationsProviders.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await LocationsProviders.findOne({ id: req.body.slug.id });
      res.send(
        data
          ? {
              status: true,
              msg: "Location Provider association retrieved",
              data: data,
            }
          : {
              status: false,
              msg: "Location Provider association not found",
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
      const data = await LocationsProviders.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      });
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Location Providers association retrieved",
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
      const data = await LocationsProviders.count({
        where: query.condition,
      });
      res.send({
        status: true,
        msg: "Location Provider association count retrieved",
        data: data,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await LocationsProviders.updateOne({
        where: req.body.slug,
      }).set(req.body.data);
      res.send(
        data
          ? {
              status: true,
              msg: "Location Provider association updated",
              data: data,
            }
          : {
              status: false,
              msg: "Location Provider association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await LocationsProviders.destroyOne({
        id: req.body.slug.id,
      });
      res.send(
        data
          ? {
              status: true,
              msg: "Location Provider association deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Location Provider association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await LocationsProviders.destroy({
        id: req.body.slug.ids,
      }).fetch();
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Location Provider associations deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Location Provider association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
