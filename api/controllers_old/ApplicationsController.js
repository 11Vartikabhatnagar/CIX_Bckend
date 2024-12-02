/**
 * ApplicationsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require("path");
const rootDir = sails.config.appPath;
const rmDir = require("rimraf");
const fs = require("fs");
const _ = require("@sailshq/lodash");
const MailEventsController = require("./MailEventsController");
const moment = require("moment");

module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "Application created successfully",
        data: await Applications.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  imageUpload: async (req, res) => {
    try {
      const temp = await Applications.findOne({ id: req.body.slug });
      const images = req.file("images");
      if (!temp) {
        return res.send({ status: false, msg: "solution not found", data: [] });
      } else if (!images._files && !req.body.images) {
        sails.log.warn("No image files uploaded");
        clearTimeout(images.timeouts.untilMaxBufferTimer);
        clearTimeout(images.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: images,
          fileRelativePath: `/uploads/${Applications.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const imageUploads = await sails.helpers.multifileUploadHandler(
          fileObj
        );
        res.send({
          status: true,
          msg: "Images updated successfully",
          data: await Applications.update({ id: temp.id })
            .set({ images: imageUploads.urlPaths })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  removeFromImages: async (req, res) => {
    try {
      const fileRemovePaths = req.body.data.remove_paths || null;
      const currentGallery = await Applications.findOne({
        select: ["images"],
        where: { id: req.body.slug.id },
      });
      let modifiedGallery = currentGallery.images;
      if (
        fileRemovePaths &&
        fileRemovePaths.length > 0 &&
        currentGallery.images.length > 0
      ) {
        fileRemovePaths.forEach((removePath) => {
          console.log("remove path", removePath);
          let removePathFull = path.join(
            rootDir.toString(),
            "assets",
            `${removePath}`
          );
          if (fs.existsSync(removePathFull)) {
            fs.unlink(removePathFull, function (err) {
              if (err) {
                throw err;
              } else {
                sails.log("Successfully deleted the file.");
              }
            });
          } else {
            throw {
              name: "FileNotFound",
              message: `${removePath} does not exist`,
            };
          }
          if (~modifiedGallery.indexOf(removePath)) {
            modifiedGallery.splice(modifiedGallery.indexOf(removePath), 1);
          }
        });
        res.send({
          status: true,
          msg: "Gallery updated successfully",
          data: await Applications.update({ id: currentGallery.id })
            .set({ images: modifiedGallery })
            .fetch(),
        });
      } else {
        res.send({
          status: false,
          msg: "provide file paths to remove",
          data: [],
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  addToImages: async (req, res) => {
    try {
      const temp = await Applications.findOne({ id: req.body.slug });
      const images = req.file("images");
      if (!temp) {
        return res.send({ status: false, msg: "solution not found", data: [] });
      } else if (!images._files && !req.body.images) {
        sails.log.warn("No image files uploaded");
        clearTimeout(images.timeouts.untilMaxBufferTimer);
        clearTimeout(images.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: images,
          fileRelativePath: `/uploads/${Applications.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const imageUploads = await sails.helpers.multifileUploadHandler(
          fileObj
        );
        res.send({
          status: true,
          msg: "images updated successfully",
          data: await Applications.update({ id: temp.id })
            .set({ images: [...temp.images, ...imageUploads.urlPaths] })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await Applications.findOne(req.body.slug)
        .populate("frg_provider_id")
        .populate("frg_anchor_id")
        .populate("eoi")
        .populate("frg_challenge_id")
        .populate("frg_challenge_sector_id");
      res.send(
        data
          ? { status: true, msg: "Application retrieved", data: data }
          : { status: false, msg: "Application not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Applications.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit || 10,
        skip: query.pagination.skip || 0,
      })
        .populate("frg_provider_id")
        .populate("frg_anchor_id")
        .populate("eoi")
        .populate("frg_challenge_id")
        .populate("frg_challenge_sector_id");
      res.send(
        data.length > 0
          ? { status: true, msg: "Applications retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Applications.count({
        where: query.condition,
      });
      res.send({
        status: true,
        msg: "Applications count retrieved",
        data: data,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Applications.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Application updated", data: data }
          : { status: false, msg: "Application not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const temp = await Applications.findOne({ id: req.body.slug.id });
      if (_.isEmpty(temp)) {
        return res.send({
          status: false,
          msg: "Application not found",
          data: temp,
        });
      } else {
        if (!_.isEmpty(temp.past_pilot_doc)) {
          rmDir(
            path.join(
              rootDir.toString(),
              "assets",
              "uploads",
              `${Applications.tableName}`,
              `${temp.id}`
            ),
            (err) => {
              if (err) throw err;
              sails.log.info("directory deleted");
            }
          );
        }
        res.send({
          status: true,
          msg: "Provider deleted successfully",
          data: await Applications.destroyOne({ id: temp.id }),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const temp = await Applications.find({ id: req.body.slug.ids });
      if (_.isEmpty(temp)) {
        return res.send({
          status: false,
          msg: "Applications not found",
          data: temp,
        });
      } else {
        temp.forEach((element) => {
          if (!_.isEmpty(element.past_pilot_doc)) {
            rmDir(
              path.join(
                rootDir.toString(),
                "assets",
                "uploads",
                `${Applications.tableName}`,
                `${element.id}`
              ),
              (err) => {
                if (err) throw err;
                sails.log.info("directory deleted");
              }
            );
          }
        });
        res.send({
          status: true,
          msg: "Applications deleted successfully",
          data: await Applications.destroy({ id: req.body.slug.ids }),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
