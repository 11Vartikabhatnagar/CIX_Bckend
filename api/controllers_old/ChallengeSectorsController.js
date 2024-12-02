/**
 * ChallengeSectorsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require("path");
const rootDir = sails.config.appPath;
const rmDir = require("rimraf");

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Challenge Sector created successfully",
        data: await ChallengeSectors.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const temp = await ChallengeSectors.findOne({ id: req.body.slug });
      const avatar = req.file("avatar");
      if (!temp) {
        return res.send({ status: false, msg: "user not found", data: [] });
      } else if (!avatar._files[0] && !req.body.avatar) {
        sails.log.warn("No image files uploaded");
        clearTimeout(avatar.timeouts.untilMaxBufferTimer);
        clearTimeout(avatar.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload an avatar to update",
          data: [],
        });
      } else {
        if (temp.avatar != sails.config.globals.default_assets.default_img)
          rmDir(
            path.join(rootDir.toString(), "assets", `${temp.avatar}`),
            async (err) => {
              if (err) throw err;
              sails.log.info("old avatar deleted");
            }
          );
        const fileObj = {
          fileBLOB: avatar,
          fileName:
            path
              .parse(avatar._files[0].stream.filename)
              .name.toLowerCase()
              .replace(/\s/g, "_") + `_${new Date().getTime()}`,
          fileRelativePath: `/uploads/${ChallengeSectors.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const images = await sails.helpers.singleFileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "avatar updated successfully",
          data: await ChallengeSectors.update({ id: temp.id })
            .set({ avatar: images.urlPath })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  removeAvatar: async (req, res) => {
    try {
      const temp = await ChallengeSectors.findOne({ id: req.body.slug.id });
      if (!temp) {
        return res.send({ status: false, msg: "user not found", data: [] });
      } else {
        if (temp.avatar != sails.config.globals.default_assets.default_img) {
          rmDir(
            path.join(rootDir.toString(), "assets", `${temp.avatar}`),
            async (err) => {
              if (err) throw err;
              sails.log.info("old avatar deleted");
            }
          );
          res.send({
            status: true,
            msg: "avatar removed successfully",
            data: await ChallengeSectors.updateOne({ id: temp.id }).set({
              avatar: sails.config.globals.default_assets.default_img,
            }),
          });
        } else {
          res.send({
            status: false,
            msg: "no avatar found to remove",
            data: [],
          });
        }
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await ChallengeSectors.findOne({ id: req.body.slug.id })
        .populate("providers")
        .populate("seekers")
        .populate("challenges")
        .populate("solutions");
      res.send(
        data
          ? { status: true, msg: "Challenge Sector retrieved", data: data }
          : { status: false, msg: "Challenge Sector not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await ChallengeSectors.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      })
        .populate("providers")
        .populate("seekers")
        .populate("challenges")
        .populate("solutions");
      res.send(
        data.length > 0
          ? { status: true, msg: "Challenge Sectors retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await ChallengeSectors.count({
        where: query.condition,
      });
      res.send({
        status: true,
        msg: "Challenge Sectors count retrieved",
        data: data,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await ChallengeSectors.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Challenge Sector updated", data: data }
          : { status: false, msg: "Challenge Sector not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const temp = await ChallengeSectors.findOne({ id: req.body.slug.id });
      if (!temp)
        return res.send({
          status: false,
          msg: "Challenge Sector not found",
          data: temp,
        });
      else if (temp.avatar != sails.config.globals.default_assets.default_img)
        rmDir(
          path.join(
            rootDir.toString(),
            "assets",
            "uploads",
            `${ChallengeSectors.tableName}`,
            `${temp.id}`
          ),
          (err) => {
            if (err) throw err;
            sails.log.info("directory deleted");
          }
        );
      res.send({
        status: true,
        msg: "Challenge Sector deleted successfully",
        data: await ChallengeSectors.destroyOne({ id: temp.id }),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const solutions = await ChallengeSectors.find({
        where: { id: req.body.slug.ids },
        select: ["id", "avatar"],
      });
      if (solutions.length <= 0)
        return res.send({
          status: false,
          msg: "Challenge Sector not found",
          data: solutions,
        });
      solutions.forEach((solution) => {
        if (solution.avatar != sails.config.globals.default_assets.default_img)
          rmDir(
            path.join(
              rootDir.toString(),
              "assets",
              "uploads",
              `${ChallengeSectors.tableName}`,
              `${solution.id}`
            ),
            (err) => {
              if (err) throw err;
              sails.log.info("directory deleted");
            }
          );
      });
      res.send({
        status: true,
        msg: "Challenge Sectors deleted successfully",
        data: await ChallengeSectors.destroy({ id: req.body.slug.ids }).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
