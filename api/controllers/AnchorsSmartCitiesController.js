/**
 * AnchorsSmartCitiesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Anchor Smart City association created",
        data: await AnchorsSmartCities.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await AnchorsSmartCities.findOne({ id: req.body.slug.id });
      res.send(
        data
          ? {
              status: true,
              msg: "Anchor Smart City association retrieved",
              data: data,
            }
          : {
              status: false,
              msg: "Anchor Smart City association not found",
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
      const data = await AnchorsSmartCities.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      });
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Anchors Smart Cities association retrieved",
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
      const data = await AnchorsSmartCities.count({
        where: query.condition,
      });
      res.send({
        status: true,
        msg: "Anchor Smart City association count retrieved",
        data: data,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await AnchorsSmartCities.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? {
              status: true,
              msg: "Anchor Smart City association updated",
              data: data,
            }
          : {
              status: false,
              msg: "Anchor Smart City association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await AnchorsSmartCities.destroyOne({
        id: req.body.slug.id,
      });
      res.send(
        data
          ? {
              status: true,
              msg: "Anchor Smart City association deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Anchor Smart City association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await AnchorsSmartCities.destroy({
        id: req.body.slug.ids,
      }).fetch();
      res.send(
        data.length > 0
          ? {
              status: true,
              msg: "Anchor Smart City associations deleted successfully",
              data: data,
            }
          : {
              status: false,
              msg: "Anchor Smart City association not found",
              data: data,
            }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
