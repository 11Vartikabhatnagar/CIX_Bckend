/**
 * LocationsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Location created successfully",
        data: await Locations.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  list: async (req, res) => {
    const locationList = await Locations.find({
      select: ["name"],
      sort: "name ASC",
    });
    res.send(
      locationList
        ? { status: true, msg: "Location retrieved", data: locationList }
        : { status: false, msg: "Location not found", data: locationList }
    );
  },

  select: async (req, res) => {
    try {
      const data = await Locations.findOne({ id: req.body.slug.id })
        .populate("provider")
        .populate("seeker")
        .populate("eoi")
        .populate("applications");
      res.send(
        data
          ? { status: true, msg: "Location retrieved", data: data }
          : { status: false, msg: "Location not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Locations.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      })
        .populate("provider")
        .populate("seeker")
        .populate("eoi")
        .populate("applications");
      res.send(
        data.length > 0
          ? { status: true, msg: "Locations retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Locations.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "Locations count retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Locations.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Location updated", data: data }
          : { status: false, msg: "Location not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await Locations.destroyOne({ id: req.body.slug.id });
      res.send(
        data
          ? { status: true, msg: "Location deleted successfully", data: data }
          : { status: false, msg: "Location not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await Locations.destroy({ id: req.body.slug.ids }).fetch();
      res.send(
        data.length > 0
          ? { status: true, msg: "Locations deleted successfully", data: data }
          : { status: false, msg: "Locations not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
