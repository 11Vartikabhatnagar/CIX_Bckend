/**
 * SmartCitiesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require("path");
const rootDir = sails.config.appPath;
const rmDir = require("rimraf");
const fs = require("fs");
module.exports = {
  create: async (req, res) => {
    try {
      res.send({
        status: true,
        msg: "City created successfully",
        data: await SmartCities.create(req.body.data).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  updateCEOAvatar: async (req, res) => {
    try {
      const temp = await SmartCities.findOne({ id: req.body.slug });
      const CeoAvatar = req.file("ceo_avatar");
      if (!temp) {
        return res.send({ status: false, msg: "city not found", data: [] });
      } else if (!CeoAvatar._files[0] && !req.body.ceo_avatar) {
        sails.log.warn("No image files uploaded");
        clearTimeout(CeoAvatar.timeouts.untilMaxBufferTimer);
        clearTimeout(CeoAvatar.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload an avatar to update",
          data: [],
        });
      } else {
        if (temp.ceo_avatar != sails.config.globals.default_assets.avatar)
          rmDir(
            path.join(rootDir.toString(), "assets", `${temp.ceo_avatar}`),
            async (err) => {
              if (err) throw err;
              sails.log.info("old avatar deleted");
            }
          );
        const fileObj = {
          fileBLOB: CeoAvatar,
          fileName:
            path
              .parse(CeoAvatar._files[0].stream.filename)
              .name.toLowerCase()
              .replace(/\s/g, "_") + `_${new Date().getTime()}`,
          fileRelativePath: `/uploads/${SmartCities.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const images = await sails.helpers.singleFileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "avatar updated successfully",
          data: await SmartCities.update({ id: temp.id })
            .set({ ceo_avatar: images.urlPath })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const temp = await SmartCities.findOne({ id: req.body.slug });
      const avatar = req.file("avatar");
      if (!temp) {
        return res.send({ status: false, msg: "city not found", data: [] });
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
          fileRelativePath: `/uploads/${SmartCities.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const images = await sails.helpers.singleFileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "avatar updated successfully",
          data: await SmartCities.update({ id: temp.id })
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
      const temp = await SmartCities.findOne({ id: req.body.slug.id });
      if (!temp) {
        return res.send({ status: false, msg: "city not found", data: [] });
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
            data: await SmartCities.updateOne({ id: temp.id }).set({
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

  uploadCityLogo: async (req, res) => {
    try {
      const temp = await SmartCities.findOne({ id: req.body.slug });
      const city_logo = req.file("city_logo");
      if (!temp) {
        return res.send({ status: false, msg: "city not found", data: [] });
      } else if (!city_logo._files[0] && !req.body.city_logo) {
        sails.log.warn("No image files uploaded");
        clearTimeout(city_logo.timeouts.untilMaxBufferTimer);
        clearTimeout(city_logo.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "Upload a Logo to update",
          data: [],
        });
      } else {
        if (temp.city_logo != "")
          rmDir(
            path.join(rootDir.toString(), "assets", `${temp.city_logo}`),
            async (err) => {
              if (err) throw err;
              sails.log.info("old logo deleted");
            }
          );
        const fileObj = {
          fileBLOB: city_logo,
          fileName:
            path
              .parse(city_logo._files[0].stream.filename)
              .name.toLowerCase()
              .replace(/\s/g, "_") + `_${new Date().getTime()}`,
          fileRelativePath: `/uploads/${SmartCities.tableName}/${temp.id}`,
        };
        sails.log.info("logo image upload started");
        const images = await sails.helpers.singleFileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "City updated successfully",
          data: await SmartCities.update({ id: temp.id })
            .set({ city_logo: images.urlPath })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  uploadCityMap: async (req, res) => {
    try {
      const temp = await SmartCities.findOne({ id: req.body.slug });
      const city_map = req.file("city_map");
      if (!temp) {
        return res.send({ status: false, msg: "city not found", data: [] });
      } else if (!city_map._files[0] && !req.body.city_map) {
        sails.log.warn("No image files uploaded");
        clearTimeout(city_map.timeouts.untilMaxBufferTimer);
        clearTimeout(city_map.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload a map to update",
          data: [],
        });
      } else {
        if (temp.city_map != "")
          rmDir(
            path.join(rootDir.toString(), "assets", `${temp.city_map}`),
            async (err) => {
              if (err) throw err;
              sails.log.info("old map deleted");
            }
          );
        const fileObj = {
          fileBLOB: city_map,
          fileName:
            path
              .parse(city_map._files[0].stream.filename)
              .name.toLowerCase()
              .replace(/\s/g, "_") + `_${new Date().getTime()}`,
          fileRelativePath: `/uploads/${SmartCities.tableName}/${temp.id}`,
        };
        sails.log.info("map image upload started");
        const images = await sails.helpers.singleFileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "City updated successfully",
          data: await SmartCities.update({ id: temp.id })
            .set({ city_map: images.urlPath })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  uploadCityGallery: async (req, res) => {
    try {
      const temp = await SmartCities.findOne({ id: req.body.slug });
      const gallery = req.file("gallery");
      if (!temp) {
        return res.send({ status: false, msg: "solution not found", data: [] });
      } else if (!gallery._files && !req.body.gallery) {
        sails.log.warn("No image files uploaded");
        clearTimeout(gallery.timeouts.untilMaxBufferTimer);
        clearTimeout(gallery.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: gallery,
          fileRelativePath: `/uploads/${SmartCities.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const imageUploads = await sails.helpers.multifileUploadHandler(
          fileObj
        );
        res.send({
          status: true,
          msg: "Gallery updated successfully",
          data: await SmartCities.update({ id: temp.id })
            .set({ gallery: imageUploads.urlPaths })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  removeFromGallery: async (req, res) => {
    try {
      const fileRemovePaths = req.body.data.remove_paths || null;
      const currentGallery = await SmartCities.findOne({
        select: ["gallery"],
        where: { id: req.body.slug.id },
      });
      let modifiedGallery = currentGallery.gallery;
      if (
        fileRemovePaths &&
        fileRemovePaths.length > 0 &&
        currentGallery.gallery.length > 0
      ) {
        fileRemovePaths.forEach((removePath) => {
          // console.log("remove path", removePath);
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
          // console.log("remove index", modifiedGallery.indexOf(removePath));
          // console.log("current", modifiedGallery);
          if (~modifiedGallery.indexOf(removePath)) {
            modifiedGallery.splice(modifiedGallery.indexOf(removePath), 1);
          }
        });
        res.send({
          status: true,
          msg: "Gallery updated successfully",
          data: await SmartCities.update({ id: currentGallery.id })
            .set({ gallery: modifiedGallery })
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

  addToGallery: async (req, res) => {
    const temp = await SmartCities.findOne({ id: req.body.slug });
    const gallery = req.file("gallery");
    if (!temp) {
      return res.send({ status: false, msg: "solution not found", data: [] });
    } else if (!gallery._files && !req.body.gallery) {
      sails.log.warn("No image files uploaded");
      clearTimeout(gallery.timeouts.untilMaxBufferTimer);
      clearTimeout(gallery.timeouts.untilFirstFileTimer);
      return res.send({
        status: false,
        msg: "upload files to update",
        data: [],
      });
    } else {
      const fileObj = {
        fileBLOB: gallery,
        fileRelativePath: `/uploads/${SmartCities.tableName}/${temp.id}`,
      };
      sails.log.info("image upload started");
      const imageUploads = await sails.helpers.multifileUploadHandler(fileObj);
      res.send({
        status: true,
        msg: "Gallery updated successfully",
        data: await SmartCities.update({ id: temp.id })
          .set({ gallery: [...temp.gallery, ...imageUploads.urlPaths] })
          .fetch(),
      });
    }
  },

  selectById: async (req, res) => {
    try {
      const data = await SmartCities.findOne({ id: req.body.slug.id })
        .populate("seekers")
        .populate("providers")
        .populate("anchors")
        .populate("challenge_sectors")
        .populate("challenges")
        .populate("solutions");
      res.send(
        data
          ? { status: true, msg: "City retrieved", data: data }
          : { status: false, msg: "City not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = queryBuilder(req.body);
      const data = await SmartCities.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      })
        .populate("seekers")
        .populate("providers")
        .populate("anchors")
        .populate("challenge_sectors")
        .populate("challenges")
        .populate("solutions");
      res.send(
        data.length > 0
          ? { status: true, msg: "Smart Cities retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  list: async (req, res) => {
    const cityList = await SmartCities.find({
      select: ["name"],
      sort: "name ASC",
    });
    res.send(
      cityList.length > 0
        ? { status: true, msg: "Smart Cities retrieved", data: cityList }
        : { status: false, msg: "No records found", data: cityList }
    );
  },

  count: async (req, res) => {
    try {
      const query = queryBuilder(req.body);
      const data = await SmartCities.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "City count retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await SmartCities.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "City updated", data: data }
          : { status: false, msg: "City not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const temp = await SmartCities.findOne({ id: req.body.slug.id });
      if (!temp)
        return res.send({ status: false, msg: "City not found", data: temp });
      else
        rmDir(
          path.join(
            rootDir.toString(),
            "assets",
            "uploads",
            `${SmartCities.tableName}`,
            `${temp.id}`
          ),
          (err) => {
            if (err) throw err;
            sails.log.info("directory deleted");
          }
        );
      res.send({
        status: true,
        msg: "City deleted successfully",
        data: await SmartCities.destroyOne({ id: temp.id }),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const cities = await SmartCities.find({
        where: { id: req.body.slug.ids },
      });
      if (cities.length <= 0)
        return res.send({
          status: false,
          msg: "Cities not found",
          data: cities,
        });
      cities.forEach((city) => {
        rmDir(
          path.join(
            rootDir.toString(),
            "assets",
            "uploads",
            `${SmartCities.tableName}`,
            `${city.id}`
          ),
          (err) => {
            if (err) throw err;
            sails.log.info("directory deleted");
          }
        );
      });
      res.send({
        status: true,
        msg: "Cities deleted successfully",
        data: await SmartCities.destroy({ id: req.body.slug.ids }).fetch(),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};

function queryBuilder(inputs) {
  const queryParams = inputs;
  let query = {
    condition: {},
    sort: null,
    pagination: {},
  };
  for (let [key, value] of Object.entries(queryParams)) {
    if (key === "slug") Object.assign(query.condition, value);
    else if (key === "filter") {
      Object.assign(query.condition, value);
    } else if (key === "search") {
      Object.assign(query.condition, value);
    } else if (key === "sort") query.sort = value;
    else if (key === "pg") query.pagination = value;
  }
  return query;
}
