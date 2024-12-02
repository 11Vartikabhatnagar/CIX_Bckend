/**
 * EOIController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "EOI created successfully",
        data: await EOI.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await EOI.findOne({ id: req.body.slug.id })
        .populate("frg_seeker_id")
        .populate("frg_anchor_id")
        .populate("frg_application_id")
        .populate("proposals");
      res.send(
        data
          ? { status: true, msg: "EOI retrieved", data: data }
          : { status: false, msg: "EOI not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await EOI.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      })
        .populate("frg_seeker_id")
        .populate("frg_anchor_id")
        .populate("frg_application_id")
        .populate("proposals");
      res.send(
        data.length > 0
          ? { status: true, msg: "EOI retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await EOI.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "EOI count retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await EOI.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "EOI updated", data: data }
          : { status: false, msg: "EOI not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await EOI.destroyOne({ id: req.body.slug.id });
      res.send(
        data
          ? { status: true, msg: "EOI deleted successfully", data: data }
          : { status: false, msg: "EOI not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await EOI.destroy({ id: req.body.slug.ids }).fetch();
      res.send(
        data.length > 0
          ? { status: true, msg: "EOI deleted successfully", data: data }
          : { status: false, msg: "EOI not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
