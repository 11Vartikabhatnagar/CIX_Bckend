/**
 * ProposalController
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
        msg: "Proposal created successfully",
        data: await Proposal.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  pilotDocUpload: async (req, res) => {
    try {
      const temp = await Proposal.findOne({ id: req.body.slug });
      const pilotDocs = req.file("pilot_docs");
      if (!temp) {
        return res.send({ status: false, msg: "Proposal not found", data: [] });
      } else if (!pilotDocs._files && !req.body.pilotDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(pilotDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(pilotDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: pilotDocs,
          fileRelativePath: `/uploads/${Proposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "Docs updated successfully",
          data: await Proposal.update({ id: temp.id })
            .set({ reports_of_past_pilot: docUploads.urlPaths })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  removeFromPilotDoc: async (req, res) => {
    try {
      const fileRemovePaths = req.body.data.remove_paths || null;
      const currentUploads = await Proposal.findOne({
        select: ["reports_of_past_pilot"],
        where: { id: req.body.slug.id },
      });
      let modifiedUploads = currentUploads.reports_of_past_pilot;
      if (
        fileRemovePaths &&
        fileRemovePaths.length > 0 &&
        currentUploads.reports_of_past_pilot.length > 0
      ) {
        fileRemovePaths.forEach((removePath) => {
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
          if (~modifiedUploads.indexOf(removePath)) {
            modifiedUploads.splice(modifiedUploads.indexOf(removePath), 1);
          }
        });
        res.send({
          status: true,
          msg: "Proposal updated successfully",
          data: await Proposal.update({ id: currentUploads.id })
            .set({ reports_of_past_pilot: modifiedUploads })
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

  addToPastPilotUpload: async (req, res) => {
    try {
      const temp = await Proposal.findOne({ id: req.body.slug });
      const pilotDocs = req.file("pilot_docs");
      if (!temp) {
        return res.send({ status: false, msg: "proposal not found", data: [] });
      } else if (!pilotDocs._files && !req.body.pilotDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(pilotDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(pilotDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: pilotDocs,
          fileRelativePath: `/uploads/${Proposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "pilotDocs updated successfully",
          data: await Proposal.update({ id: temp.id })
            .set({
              reports_of_past_pilot: [
                ...temp.reports_of_past_pilot,
                ...docUploads.urlPaths,
              ],
            })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  additionalDocUpload: async (req, res) => {
    try {
      const temp = await Proposal.findOne({ id: req.body.slug });
      const pilotDocs = req.file("additional_docs");
      if (!temp) {
        return res.send({ status: false, msg: "Proposal not found", data: [] });
      } else if (!pilotDocs._files && !req.body.pilotDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(pilotDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(pilotDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: pilotDocs,
          fileRelativePath: `/uploads/${Proposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "Docs updated successfully",
          data: await Proposal.update({ id: temp.id })
            .set({ additional_details: docUploads.urlPaths })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  removeFromAdditionalDoc: async (req, res) => {
    try {
      const fileRemovePaths = req.body.data.remove_paths || null;
      const currentUploads = await Proposal.findOne({
        select: ["additional_details"],
        where: { id: req.body.slug.id },
      });
      let modifiedUploads = currentUploads.additional_details;
      if (
        fileRemovePaths &&
        fileRemovePaths.length > 0 &&
        currentUploads.additional_details.length > 0
      ) {
        fileRemovePaths.forEach((removePath) => {
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
          if (~modifiedUploads.indexOf(removePath)) {
            modifiedUploads.splice(modifiedUploads.indexOf(removePath), 1);
          }
        });
        res.send({
          status: true,
          msg: "Proposal updated successfully",
          data: await Proposal.update({ id: currentUploads.id })
            .set({ additional_details: modifiedUploads })
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

  addToAdditionalUpload: async (req, res) => {
    try {
      const temp = await Proposal.findOne({ id: req.body.slug });
      const additionalDocs = req.file("additional_docs");
      if (!temp) {
        return res.send({ status: false, msg: "proposal not found", data: [] });
      } else if (!additionalDocs._files && !req.body.additionalDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(additionalDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(additionalDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: additionalDocs,
          fileRelativePath: `/uploads/${Proposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "additionalDocs updated successfully",
          data: await Proposal.update({ id: temp.id })
            .set({
              additional_details: [
                ...temp.additional_details,
                ...docUploads.urlPaths,
              ],
            })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  pilotOrderUpload: async (req, res) => {
    try {
      const temp = await Proposal.findOne({ id: req.body.slug });
      const pilotDocs = req.file("pilot_order");
      if (!temp) {
        return res.send({ status: false, msg: "Proposal not found", data: [] });
      } else if (!pilotDocs._files && !req.body.pilotDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(pilotDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(pilotDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: pilotDocs,
          fileRelativePath: `/uploads/${Proposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "Docs updated successfully",
          data: await Proposal.update({ id: temp.id })
            .set({ pilot_order: docUploads.urlPaths })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  addToPilotOrderUpload: async (req, res) => {
    try {
      const temp = await Proposal.findOne({ id: req.body.slug });
      const additionalDocs = req.file("pilot_order");
      if (!temp) {
        return res.send({ status: false, msg: "proposal not found", data: [] });
      } else if (!additionalDocs._files && !req.body.additionalDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(additionalDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(additionalDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: additionalDocs,
          fileRelativePath: `/uploads/${Proposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "Pilot order updated successfully",
          data: await Proposal.update({ id: temp.id })
            .set({
              pilot_order: [...temp.pilot_order, ...docUploads.urlPaths],
            })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  removeFromPilotOrderUpload: async (req, res) => {
    try {
      const fileRemovePaths = req.body.data.remove_paths || null;
      const currentUploads = await Proposal.findOne({
        select: ["pilot_order"],
        where: { id: req.body.slug.id },
      });
      let modifiedUploads = currentUploads.pilot_order;
      if (
        fileRemovePaths &&
        fileRemovePaths.length > 0 &&
        currentUploads.pilot_order.length > 0
      ) {
        fileRemovePaths.forEach((removePath) => {
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
          if (~modifiedUploads.indexOf(removePath)) {
            modifiedUploads.splice(modifiedUploads.indexOf(removePath), 1);
          }
        });
        res.send({
          status: true,
          msg: "Proposal updated successfully",
          data: await Proposal.update({ id: currentUploads.id })
            .set({ pilot_order: modifiedUploads })
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

  pilotReportUpload: async (req, res) => {
    try {
      const temp = await Proposal.findOne({ id: req.body.slug });
      const pilotDocs = req.file("pilot_report");
      if (!temp) {
        return res.send({ status: false, msg: "Proposal not found", data: [] });
      } else if (!pilotDocs._files && !req.body.pilotDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(pilotDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(pilotDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: pilotDocs,
          fileRelativePath: `/uploads/${Proposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "Docs updated successfully",
          data: await Proposal.update({ id: temp.id })
            .set({ pilot_report: docUploads.urlPaths })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  addToPilotReportUpload: async (req, res) => {
    try {
      const temp = await Proposal.findOne({ id: req.body.slug });
      const additionalDocs = req.file("pilot_report");
      if (!temp) {
        return res.send({ status: false, msg: "proposal not found", data: [] });
      } else if (!additionalDocs._files && !req.body.additionalDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(additionalDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(additionalDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: additionalDocs,
          fileRelativePath: `/uploads/${Proposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "Pilot order updated successfully",
          data: await Proposal.update({ id: temp.id })
            .set({
              pilot_report: [...temp.pilot_report, ...docUploads.urlPaths],
            })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  removeFromPilotReportUpload: async (req, res) => {
    try {
      const fileRemovePaths = req.body.data.remove_paths || null;
      const currentUploads = await Proposal.findOne({
        select: ["pilot_report"],
        where: { id: req.body.slug.id },
      });
      let modifiedUploads = currentUploads.pilot_report;
      if (
        fileRemovePaths &&
        fileRemovePaths.length > 0 &&
        currentUploads.pilot_report.length > 0
      ) {
        fileRemovePaths.forEach((removePath) => {
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
          if (~modifiedUploads.indexOf(removePath)) {
            modifiedUploads.splice(modifiedUploads.indexOf(removePath), 1);
          }
        });
        res.send({
          status: true,
          msg: "Proposal updated successfully",
          data: await Proposal.update({ id: currentUploads.id })
            .set({ pilot_report: modifiedUploads })
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

  select: async (req, res) => {
    try {
      const data = await Proposal.findOne({ id: req.body.slug.id })
        .populate("frg_provider_id")
        .populate("frg_anchor_id")
        .populate("frg_eoi_id");
      res.send(
        data
          ? { status: true, msg: "Proposal retrieved", data: data }
          : { status: false, msg: "Proposal not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Proposal.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      })
        .populate("frg_provider_id")
        .populate("frg_anchor_id")
        .populate("frg_eoi_id");
      res.send(
        data.length > 0
          ? { status: true, msg: "Proposal retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Proposal.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "Proposal count retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Proposal.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Proposal updated", data: data }
          : { status: false, msg: "Proposal not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await Proposal.destroyOne({ id: req.body.slug.id });
      res.send(
        data
          ? { status: true, msg: "Proposal deleted successfully", data: data }
          : { status: false, msg: "Proposal not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await Proposal.destroy({ id: req.body.slug.ids }).fetch();
      res.send(
        data.length > 0
          ? { status: true, msg: "Proposal deleted successfully", data: data }
          : { status: false, msg: "Proposal not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
