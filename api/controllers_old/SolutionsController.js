/**
 * SolutionsController
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
      const newSolution = await Solutions.create(req.body.data).fetch();
      res.send({
        status: true,
        msg: "Solution created successfully",
        data: newSolution,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  imageUpload: async (req, res) => {
    try {
      const temp = await Solutions.findOne({ id: req.body.slug });
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
          fileRelativePath: `/uploads/${Solutions.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const imageUploads = await sails.helpers.multifileUploadHandler(
          fileObj
        );
        res.send({
          status: true,
          msg: "Images updated successfully",
          data: await Solutions.update({ id: temp.id })
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
      const currentGallery = await Solutions.findOne({
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
          data: await Solutions.update({ id: currentGallery.id })
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
      const temp = await Solutions.findOne({ id: req.body.slug });
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
          fileRelativePath: `/uploads/${Solutions.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const imageUploads = await sails.helpers.multifileUploadHandler(
          fileObj
        );
        res.send({
          status: true,
          msg: "images updated successfully",
          data: await Solutions.update({ id: temp.id })
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
      const data = await Solutions.findOne(req.body.slug)
        .populate("frg_provider_id")
        .populate("challenge_sectors")
        .populate("challenges")
        .populate("frg_anchor_id")
        .populate("smart_cities");
      res.send(
        data
          ? { status: true, msg: "Solution retrieved", data: data }
          : { status: false, msg: "Solution not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Solutions.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit || 10,
        skip: query.pagination.skip || 0,
      })
        .populate("frg_provider_id")
        .populate("challenge_sectors")
        .populate("challenges")
        .populate("frg_anchor_id")
        .populate("smart_cities");
      res.send(
        data.length > 0
          ? { status: true, msg: "Solutions retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  discoverSolutions: async (req, res) => {
    try {
      const sortBy = req.body.sort || "created_at DESC";
      const limit = req.body.pg.limit || 10;
      const offSet = req.body.pg.skip || 0;
      const searchString = req.body.search.name || "";
      let conditionClause = `AND frg_solutions.name LIKE '%${searchString}%'`;
      let joinConditionClause = ``;

      if (req.body.filter.sector) {
        conditionClause = conditionClause.concat(
          " ",
          `AND frg_challenge_sectors.id IN (${req.body.filter.sector})`
        );
      }

      if (req.body.filter.stage) {
        let quotedAndCommaSeparated =
          "'" + req.body.filter.stage.join("','") + "'";
        conditionClause = conditionClause.concat(
          " ",
          `AND frg_solutions.stage IN (${quotedAndCommaSeparated})`
        );
      }

      if (req.body.filter.location) {
        joinConditionClause = joinConditionClause.concat(
          " ",
          `WHERE frg_locations.id IN (${req.body.filter.location})`
        );
      }

      if (req.body.filter.teamsize) {
        let filterClausesArr = req.body.filter.teamsize;
        let teamsizeFilterCondition;
        filterClausesArr.forEach((t, i) => {
          if (i === 0) {
            if (t.to === null) {
              teamsizeFilterCondition = `COALESCE(frg_providers.startup_teamsize,0) >= ${t.from} OR COALESCE(frg_providers.enterprise_company_size,0) >= ${t.from}`;
            } else {
              teamsizeFilterCondition = `COALESCE(frg_providers.startup_teamsize,0) BETWEEN ${t.from} AND ${t.to} OR COALESCE(frg_providers.enterprise_company_size,0) BETWEEN ${t.from} AND ${t.to}`;
            }
          } else {
            if (t.to === null) {
              teamsizeFilterCondition = teamsizeFilterCondition.concat(
                " ",
                `OR COALESCE(frg_providers.startup_teamsize,0) >= ${t.from} OR COALESCE(frg_providers.enterprise_company_size,0) >= ${t.from}`
              );
            } else {
              teamsizeFilterCondition = teamsizeFilterCondition.concat(
                " ",
                `OR COALESCE(frg_providers.startup_teamsize,0) BETWEEN ${t.from} AND ${t.to} OR COALESCE(frg_providers.enterprise_company_size,0) BETWEEN ${t.from} AND ${t.to}`
              );
            }
          }
        });

        if (teamsizeFilterCondition) {
          if (joinConditionClause != ``) {
            joinConditionClause = joinConditionClause.concat(
              " ",
              `AND (${teamsizeFilterCondition})`
            );
          } else {
            joinConditionClause = joinConditionClause.concat(
              " ",
              `WHERE (${teamsizeFilterCondition})`
            );
          }
        }
      }

      let dataQuery = `
      SELECT
          frg_solutions.id,
          frg_solutions.name,
          frg_solutions.stage,
          frg_solutions.images,
          frg_solutions.created_at,
          frg_solutions.updated_at,
          providers.provider_id,
          providers.provider_name,
          providers.provider_role,
          providers.startup_name,
          providers.enterprise_name
      FROM
          frg_solutions
      INNER JOIN(
          SELECT
              frg_providers.id AS provider_id,
              frg_providers.fullname AS provider_name,
              frg_providers.role AS provider_role,
              frg_providers.startup_company_name AS startup_name,
              frg_providers.enterprise_company_name AS enterprise_name,
              frg_providers.startup_teamsize,
              frg_providers.enterprise_company_size
          FROM
              frg_providers
          LEFT OUTER JOIN frg_locations_providers ON frg_providers.id = frg_locations_providers.frg_provider_id
          LEFT OUTER JOIN frg_locations ON frg_locations_providers.frg_location_id = frg_locations.id
          ${joinConditionClause}
          GROUP BY
              frg_providers.id
      ) providers
      ON
          frg_solutions.frg_provider_id = providers.provider_id
      LEFT JOIN frg_solutions_challenge_sectors ON frg_solutions.id = frg_solutions_challenge_sectors.frg_solution_id
      LEFT JOIN frg_challenge_sectors ON frg_solutions_challenge_sectors.frg_challenge_sector_id = frg_challenge_sectors.id
      WHERE
          frg_solutions.status = "active" ${conditionClause}
      GROUP BY
          frg_solutions.id
      ORDER BY ${sortBy}  LIMIT ${limit} OFFSET ${offSet}`;
      // count query
      let countQuery = `
      SELECT COUNT(*) as total_count FROM (
        SELECT
          frg_solutions.id,
          frg_solutions.name,
          frg_solutions.stage,
          frg_solutions.images,
          frg_solutions.created_at,
          frg_solutions.updated_at,
          providers.provider_id,
          providers.provider_name,
          providers.provider_role,
          providers.startup_name,
          providers.enterprise_name
      FROM
          frg_solutions
      INNER JOIN(
          SELECT
              frg_providers.id AS provider_id,
              frg_providers.fullname AS provider_name,
              frg_providers.role AS provider_role,
              frg_providers.startup_company_name AS startup_name,
              frg_providers.enterprise_company_name AS enterprise_name,
              frg_providers.startup_teamsize,
              frg_providers.enterprise_company_size
          FROM
              frg_providers
          LEFT OUTER JOIN frg_locations_providers ON frg_providers.id = frg_locations_providers.frg_provider_id
          LEFT OUTER JOIN frg_locations ON frg_locations_providers.frg_location_id = frg_locations.id
          ${joinConditionClause}
          GROUP BY
              frg_providers.id
      ) providers
      ON
          frg_solutions.frg_provider_id = providers.provider_id
      LEFT JOIN frg_solutions_challenge_sectors ON frg_solutions.id = frg_solutions_challenge_sectors.frg_solution_id
      LEFT JOIN frg_challenge_sectors ON frg_solutions_challenge_sectors.frg_challenge_sector_id = frg_challenge_sectors.id
      WHERE
          frg_solutions.status = "active" ${conditionClause}
      GROUP BY
          frg_solutions.id
      ) as countQuery`;
      const resultantRecords = await sails.sendNativeQuery(dataQuery, []);
      const totalCount = await sails.sendNativeQuery(countQuery, []);
      res.send({
        status: true,
        msg: "solutions retrieved",
        data: resultantRecords.rows,
        total_records: totalCount.rows[0].total_count,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  relatedSolutions: async (req, res) => {
    try {
      const challengeId = req.body.challenge_id || 0;
      let dataQuery = `
      SELECT
      frg_solutions.id,
      frg_solutions.created_at,
      frg_solutions.name,
      frg_solutions.images,
      frg_providers.id AS provider_id,
      frg_providers.role as provider_role,
      frg_providers.fullname AS provider_name,
      frg_providers.enterprise_company_name AS enterprise_name,
      frg_providers.startup_company_name AS startup_name,
      frg_challenges.id as challenge_id
      FROM
      frg_solutions
      JOIN frg_providers ON frg_solutions.frg_provider_id = frg_providers.id
      LEFT JOIN frg_solutions_challenges ON frg_solutions.id = frg_solutions_challenges.frg_solution_id
      LEFT JOIN frg_challenges ON frg_solutions_challenges.frg_challenge_id = frg_challenges.id 
      WHERE
      frg_solutions.status = "active" AND frg_challenges.id = ${challengeId} ORDER BY frg_solutions.created_at DESC`;
      const resultantRecords = await sails.sendNativeQuery(dataQuery, []);
      resultantRecords.rows.map((e) => {
        e.images = JSON.parse(e.images);
      });
      res.send({
        status: true,
        msg: "solutions retrieved",
        data: resultantRecords.rows,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Solutions.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "Solutions count retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Solutions.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Solution updated", data: data }
          : { status: false, msg: "Solution not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const temp = await Solutions.findOne({ id: req.body.slug.id });
      if (_.isEmpty(temp)) {
        return res.send({
          status: false,
          msg: "Solution not found",
          data: temp,
        });
      } else {
        if (!_.isEmpty(temp.images)) {
          rmDir(
            path.join(
              rootDir.toString(),
              "assets",
              "uploads",
              `${Solutions.tableName}`,
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
          msg: "solutions deleted successfully",
          data: await Solutions.destroyOne({ id: temp.id }),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const temp = await Solutions.find({ id: req.body.slug.ids });
      if (_.isEmpty(temp)) {
        return res.send({
          status: false,
          msg: "Solutions not found",
          data: temp,
        });
      } else {
        temp.forEach((element) => {
          if (!_.isEmpty(element.images)) {
            rmDir(
              path.join(
                rootDir.toString(),
                "assets",
                "uploads",
                `${Solutions.tableName}`,
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
          msg: "Solutions deleted successfully",
          data: await Solutions.destroy({ id: req.body.slug.ids }),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
  pushNewSolutionNotification: async (req, res) => {
    // trigger notification for users regarding the new solution
    try {
      const solutionData = await Solutions.findOne(req.body.slug.id)
        .populate("frg_provider_id")
        .populate("challenge_sectors")
        .populate("challenges")
        .populate("frg_anchor_id")
        .populate("smart_cities");
      triggerNotificationForNewSolutionUnderChallenge(solutionData, req);
      triggerNotificationForNewSolutionUnderSector(solutionData, req);
      res.send({
        status: true,
        msg: "notifications sent successfully",
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};

async function triggerNotificationForNewSolutionUnderSector(solutionData, req) {
  if (solutionData && solutionData.status === "active") {
    const sectorIds = solutionData.challenge_sectors.map((e) => e.id);
    const solutionSectors = solutionData.challenge_sectors;
    const seekerIdBasedOnSector = await ChallengesectorsSeekers.find({
      frg_challenge_sector_id: sectorIds,
    });
    const protocol = req.connection.encrypted ? "https" : "http";
    const baseUrl = protocol + "://" + req.headers.host;
    seekerIdBasedOnSector.forEach(async (e) => {
      let forSector = solutionSectors
        .filter((solSector) => {
          return e.frg_challenge_sector_id === solSector.id;
        })
        .map((obj) => obj.name);
      const seekerData = await Seekers.findOne({ id: e.frg_seeker_id })
        .populate("frg_user_id")
        .populate("frg_smart_city_id");
      let companyName = null;
      if (solutionData.frg_provider_id.role === "startup")
        companyName = solutionData.frg_provider_id.startup_company_name;
      else if (solutionData.frg_provider_id.role === "enterprise")
        companyName = solutionData.frg_provider_id.enterprise_company_name;
      else companyName = solutionData.frg_provider_id.fullname;
      MailEventsController.onNewSolutionCatalogueUnderSector({
        user_name: seekerData.fullname.split(" ")[0],
        avatar: `${baseUrl + seekerData.avatar}`,
        company_name: companyName,
        email: seekerData.frg_user_id.email,
        solution_name: solutionData.name,
        challenge_sector: forSector[0].toLowerCase(),
        solution_url: `${sails.config.globals.front_end_url}/solution/${solutionData.id}`,
        posted_date: moment(solutionData.updated_at).format("Do MMM, YY"),
      });
    });
  }
}

async function triggerNotificationForNewSolutionUnderChallenge(
  solutionData,
  req
) {
  if (solutionData && solutionData.status === "active") {
    const protocol = req.connection.encrypted ? "https" : "http";
    const baseUrl = protocol + "://" + req.headers.host;
    solutionData.challenges.forEach(async (challenge) => {
      let currentChallenge = await Challenges.findOne({ id: challenge.id })
        .populate("frg_challenge_sector_id")
        .populate("anchors")
        .populate("solutions")
        .populate("smart_city");
      currentChallenge.anchors.forEach(async (anchor) => {
        const seekerData = await Seekers.findOne({
          id: anchor.frg_seeker_id,
        }).populate("frg_user_id");
        let companyName = null;
        if (solutionData.frg_provider_id.role === "startup")
          companyName = solutionData.frg_provider_id.startup_company_name;
        else if (solutionData.frg_provider_id.role === "enterprise")
          companyName = solutionData.frg_provider_id.enterprise_company_name;
        else companyName = solutionData.frg_provider_id.fullname;
        if (anchor.status === "active") {
          MailEventsController.onNewSolutionCatalogueUnderChallenge({
            user_name: seekerData.fullname.split(" ")[0],
            avatar: `${baseUrl + seekerData.avatar}`,
            company_name: companyName,
            email: seekerData.frg_user_id.email,
            solution_name: solutionData.name,
            challenge_name: currentChallenge.name,
            challenge_sector:
              currentChallenge.frg_challenge_sector_id.name.toLowerCase(),
            challenge_url: `${sails.config.globals.front_end_url}/challenge/${currentChallenge.id}`,
            posted_date: moment(solutionData.updated_at).format("Do MMM, YYYY"),
          });
        }
      });
    });
  }
}
