/**
 * SeekersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require("path");
const rootDir = sails.config.appPath;
const rmDir = require("rimraf");
const MailEventsController = require("./MailEventsController");

module.exports = {
  create: async (req, res) => {
    try {
      const temp = await Seekers.create(req.body.data).fetch();
      res.send({
        status: true,
        msg: "Seeker created successfully",
        data: await Seekers.updateOne({ id: temp.id }).set({
          slug: `${temp.fullname.toLowerCase().replace(/\s/g, "_")}_${temp.id}`,
        }),
      });
      // sending verification code for the user
      MailEventsController.emailOtp(
        await Seekers.findOne({ id: temp.id }).populate("frg_user_id")
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const temp = await Seekers.findOne({ id: req.body.slug });
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
        if (temp.avatar != sails.config.globals.default_assets.avatar)
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
          fileRelativePath: `/uploads/${Seekers.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const images = await sails.helpers.singleFileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "avatar updated successfully",
          data: await Seekers.update({ id: temp.id })
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
      const temp = await Seekers.findOne({ id: req.body.slug.id });
      if (!temp) {
        return res.send({ status: false, msg: "user not found", data: [] });
      } else {
        if (temp.avatar != sails.config.globals.default_assets.avatar) {
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
            data: await Seekers.updateOne({ id: temp.id }).set({
              avatar: sails.config.globals.default_assets.avatar,
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

  selectById: async (req, res) => {
    try {
      const data = await Seekers.findOne({ id: req.body.slug.id })
        .populate("frg_user_id")
        .populate("frg_smart_city_id")
        .populate("location")
        .populate("challenge_sectors")
        .populate("anchors")
        .populate("eoi");
      res.send(
        data
          ? { status: true, msg: "Seeker retrieved", data: data }
          : { status: false, msg: "Seeker not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await Seekers.findOne(req.body.search)
        .populate("frg_user_id")
        .populate("frg_smart_city_id")
        .populate("location")
        .populate("challenge_sectors")
        .populate("anchors")
        .populate("eoi");
      res.send(
        data
          ? { status: true, msg: "Seeker retrieved", data: data }
          : { status: false, msg: "Seeker not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  approve: async (req, res) => {
    try {
      let data = await Seekers.findOne({ id: req.body.slug.id }).populate(
        "frg_user_id"
      );
      if (data) {
        await Seekers.updateOne({
          where: { id: data.id },
        }).set({ status: "active" });
        await Users.updateOne({
          where: { id: data.frg_user_id.id },
        }).set({ status: "active" });
        data = await Seekers.findOne({ id: data.id }).populate("frg_user_id");
      }
      res.send(
        data
          ? { status: true, msg: "Seeker approved", data: data }
          : { status: false, msg: "Seeker not found", data: data }
      );
      // sending approval email to user
      if (data) {
        const protocol = req.connection.encrypted ? "https" : "http";
        const baseUrl = protocol + "://" + req.headers.host;
        MailEventsController.onAccountApproval({
          user_name: data.fullname.split(" ")[0],
          avatar: `${baseUrl + data.avatar}`,
          email: data.frg_user_id.email,
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  reject: async (req, res) => {
    try {
      // console.log(req.body);
      const temp = await Seekers.findOne({ id: req.body.slug.id }).populate(
        "frg_user_id"
      );
      if (!temp) {
        return res.send({ status: false, msg: "Seeker not found", data: temp });
      } else if (temp.avatar != sails.config.globals.default_assets.avatar) {
        rmDir(
          path.join(
            rootDir.toString(),
            "assets",
            "uploads",
            `${Seekers.tableName}`,
            `${temp.id}`
          ),
          (err) => {
            if (err) throw err;
            sails.log.info("directory deleted");
          }
        );
      }
      await Seekers.destroyOne({ id: temp.id });
      await Users.destroyOne({ id: temp.frg_user_id.id });
      res.send({ status: true, msg: "Seeker rejected and deleted" });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  archive: async (req, res) => {
    try {
      let data = await Seekers.findOne({ id: req.body.slug.id }).populate(
        "frg_user_id"
      );
      if (data) {
        await Seekers.updateOne({
          where: { id: data.id },
        }).set({ status: "archive" });
        await Users.updateOne({
          where: { id: data.frg_user_id.id },
        }).set({ status: "archive" });
        data = await Seekers.findOne({ id: data.id }).populate("frg_user_id");
      }
      res.send(
        data
          ? { status: true, msg: "Seeker archived", data: data }
          : { status: false, msg: "Seeker not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Seekers.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      })
        .populate("frg_user_id")
        .populate("frg_smart_city_id")
        .populate("location")
        .populate("challenge_sectors")
        .populate("anchors")
        .populate("eoi");
      res.send(
        data.length > 0
          ? { status: true, msg: "Seekers retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Seekers.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "Seeker count retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      if (req.body.data.fullname)
        req.body.data.slug = `${req.body.data.fullname
          .toLowerCase()
          .replace(/\s/g, "_")}_${req.body.slug.id}`;
      const data = await Seekers.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Seeker updated", data: data }
          : { status: false, msg: "Seeker not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const temp = await Seekers.findOne({ id: req.body.slug.id });
      if (!temp)
        return res.send({ status: false, msg: "Seeker not found", data: temp });
      else if (temp.avatar != sails.config.globals.default_assets.avatar)
        rmDir(
          path.join(
            rootDir.toString(),
            "assets",
            "uploads",
            `${Seekers.tableName}`,
            `${temp.id}`
          ),
          (err) => {
            if (err) throw err;
            sails.log.info("directory deleted");
          }
        );
      res.send({
        status: true,
        msg: "Seeker deleted successfully",
        data: await Seekers.destroyOne({ id: temp.id }),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const solutions = await Seekers.find({
        where: { id: req.body.slug.ids },
        select: ["id", "avatar"],
      });
      if (solutions.length <= 0)
        return res.send({
          status: false,
          msg: "Seekers not found",
          data: solutions,
        });
      solutions.forEach((solution) => {
        if (solution.avatar != sails.config.globals.default_assets.avatar)
          rmDir(
            path.join(
              rootDir.toString(),
              "assets",
              "uploads",
              `${Seekers.tableName}`,
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
        msg: "Seekers deleted successfully",
        data: await Seekers.destroy({ id: req.body.slug.ids }).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
