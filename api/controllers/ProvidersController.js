/**
 * ProvidersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require("path");
const rootDir = sails.config.appPath;
const rmDir = require("rimraf");
const _ = require("@sailshq/lodash");
const MailEventsController = require("./MailEventsController");

module.exports = {
  create: async (req, res) => {
    try {
      const temp = await Providers.create(req.body.data).fetch();
      res.send({
        status: true,
        msg: "Provider created successfully",
        data: await Providers.updateOne({ id: temp.id }).set({
          slug: `${temp.fullname.toLowerCase().replace(/\s/g, "_")}_${temp.id}`,
        }),
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const temp = await Providers.findOne({ id: req.body.slug });
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
          fileRelativePath: `/uploads/${Providers.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const images = await sails.helpers.singleFileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "avatar updated successfully",
          data: await Providers.updateOne({ id: temp.id }).set({
            avatar: images.urlPath,
          }),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  removeAvatar: async (req, res) => {
    try {
      const temp = await Providers.findOne({ id: req.body.slug.id });
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
            data: await Providers.updateOne({ id: temp.id }).set({
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

  companyLogo: async (req, res) => {
    try {
      const temp = await Providers.findOne({ id: req.body.slug });
      const company_logo = req.file("company_logo");
      if (!temp) {
        return res.send({ status: false, msg: "user not found", data: [] });
      } else if (!company_logo._files[0] && !req.body.company_logo) {
        sails.log.warn("No image files uploaded");
        clearTimeout(company_logo.timeouts.untilMaxBufferTimer);
        clearTimeout(company_logo.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload an logo to update",
          data: [],
        });
      } else {
        if (!_.isEmpty(temp.company_logo)) {
          rmDir(
            path.join(rootDir.toString(), "assets", `${temp.company_logo}`),
            async (err) => {
              if (err) throw err;
              sails.log.info("old logo deleted");
            }
          );
        }
        const fileObj = {
          fileBLOB: company_logo,
          fileName:
            path
              .parse(company_logo._files[0].stream.filename)
              .name.toLowerCase()
              .replace(/\s/g, "_") + `_${new Date().getTime()}`,
          fileRelativePath: `/uploads/${Providers.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const images = await sails.helpers.singleFileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "logo updated successfully",
          data: await Providers.update({ id: temp.id })
            .set({ company_logo: images.urlPath })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  selectById: async (req, res) => {
    try {
      const data = await Providers.findOne({ id: req.body.slug.id })
        .populate("frg_user_id")
        .populate("frg_smart_city_id")
        .populate("location")
        .populate("challenge_sectors")
        .populate("solutions")
        .populate("applications");
      res.send(
        data
          ? { status: true, msg: "Provider retrieved", data: data }
          : { status: false, msg: "Provider not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await Providers.findOne(req.body.search)
        .populate("frg_user_id")
        .populate("frg_smart_city_id")
        .populate("location")
        .populate("challenge_sectors")
        .populate("solutions")
        .populate("applications");
      res.send(
        data
          ? { status: true, msg: "Provider retrieved", data: data }
          : { status: false, msg: "Provider not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Providers.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit || 10,
        skip: query.pagination.skip || 0,
      })
        .populate("frg_user_id")
        .populate("frg_smart_city_id")
        .populate("location")
        .populate("challenge_sectors")
        .populate("solutions")
        .populate("applications");
      res.send(
        data.length > 0
          ? { status: true, msg: "Providers retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  approve: async (req, res) => {
    try {
      let data = await Providers.findOne({ id: req.body.slug.id }).populate(
        "frg_user_id"
      );
      if (data) {
        await Providers.updateOne({
          where: { id: data.id },
        }).set({ status: "active" });
        await Users.updateOne({
          where: { id: data.frg_user_id.id },
        }).set({ status: "active" });
        data = await Providers.findOne({ id: data.id }).populate("frg_user_id");
      }
      res.send(
        data
          ? { status: true, msg: "provider approved", data: data }
          : { status: false, msg: "provider not found", data: data }
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
      const temp = await Providers.findOne({ id: req.body.slug.id }).populate(
        "frg_user_id"
      );
      if (!temp) {
        return res.send({
          status: false,
          msg: "provider not found",
          data: temp,
        });
      } else if (temp.avatar != sails.config.globals.default_assets.avatar) {
        rmDir(
          path.join(
            rootDir.toString(),
            "assets",
            "uploads",
            `${Providers.tableName}`,
            `${temp.id}`
          ),
          (err) => {
            if (err) throw err;
            sails.log.info("directory deleted");
          }
        );
      }
      await Providers.destroyOne({ id: temp.id });
      await Users.destroyOne({ id: temp.frg_user_id.id });
      res.send({ status: true, msg: "provider rejected and deleted" });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  archive: async (req, res) => {
    try {
      let data = await Providers.findOne({ id: req.body.slug.id }).populate(
        "frg_user_id"
      );
      if (data) {
        await Providers.updateOne({
          where: { id: data.id },
        }).set({ status: "archive" });
        await Users.updateOne({
          where: { id: data.frg_user_id.id },
        }).set({ status: "archive" });
        data = await Providers.findOne({ id: data.id }).populate("frg_user_id");
      }
      res.send(
        data
          ? { status: true, msg: "provider archived", data: data }
          : { status: false, msg: "provider not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  searchSuggestions: async (req, res) => {
    try {
      const searchString = req.body.search.name || "";
      let conditionClause = `(providers.fullname LIKE '%${searchString}%' OR providers.startup_company_name LIKE '%${searchString}%' OR providers.enterprise_company_name LIKE '%${searchString}%')`;
      let dataQuery = `
      SELECT
      providers.fullname,
      providers.startup_company_name,
      providers.enterprise_company_name
      FROM
      frg_providers AS providers
      WHERE ${conditionClause}
      ORDER BY
      startup_company_name ASC,
      enterprise_company_name ASC,
      fullname ASC LIMIT 50 OFFSET 0;`;
      const resultantRecords = await sails.sendNativeQuery(dataQuery, []);
      res.send({
        status: true,
        msg: "Providers retrieved",
        data: resultantRecords.rows,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  discoverProviders: async (req, res) => {
    try {
      let sortBy = {
        fieldName: req.body.sort.split(" ")[0],
        OrderBy: req.body.sort.split(" ")[1],
      };
      let OrderByClause;
      if (sortBy.fieldName === "fullname") {
        OrderByClause = `startup_company_name ${sortBy.OrderBy},enterprise_company_name ${sortBy.OrderBy},${sortBy.fieldName} ${sortBy.OrderBy}`;
      } else {
        OrderByClause = `${sortBy.fieldName} ${sortBy.OrderBy}`;
      }
      const limit = req.body.pg.limit || 10;
      const offSet = req.body.pg.skip || 0;
      const searchString = req.body.search.name || "";
      let conditionClause = `(providers.fullname LIKE '%${searchString}%' OR providers.startup_company_name LIKE '%${searchString}%' OR providers.enterprise_company_name LIKE '%${searchString}%')`;

      if (req.body.filter.sector) {
        conditionClause = conditionClause.concat(
          " ",
          `AND solutions.solution_sector_id IN (${req.body.filter.sector})`
        );
      }

      if (req.body.filter.location) {
        conditionClause = conditionClause.concat(
          " ",
          `AND frg_locations.id IN (${req.body.filter.location})`
        );
      }

      if (req.body.filter.role) {
        let quotedAndCommaSeparated =
          "'" + req.body.filter.role.join("','") + "'";
        conditionClause = conditionClause.concat(
          " ",
          `AND providers.role IN (${quotedAndCommaSeparated})`
        );
      }

      if (req.body.filter.teamsize) {
        let filterClausesArr = req.body.filter.teamsize;
        let teamsizeFilterCondition;
        filterClausesArr.forEach((t, i) => {
          if (i === 0) {
            if (t.to === null) {
              teamsizeFilterCondition = `COALESCE(providers.startup_teamsize,0) >= ${t.from} OR COALESCE(providers.enterprise_company_size,0) >= ${t.from}`;
            } else {
              teamsizeFilterCondition = `COALESCE(providers.startup_teamsize,0) BETWEEN ${t.from} AND ${t.to} OR COALESCE(providers.enterprise_company_size,0) BETWEEN ${t.from} AND ${t.to}`;
            }
          } else {
            if (t.to === null) {
              teamsizeFilterCondition = teamsizeFilterCondition.concat(
                " ",
                `OR COALESCE(providers.startup_teamsize,0) >= ${t.from} OR COALESCE(providers.enterprise_company_size,0) >= ${t.from}`
              );
            } else {
              teamsizeFilterCondition = teamsizeFilterCondition.concat(
                " ",
                `OR COALESCE(providers.startup_teamsize,0) BETWEEN ${t.from} AND ${t.to} OR COALESCE(providers.enterprise_company_size,0) BETWEEN ${t.from} AND ${t.to}`
              );
            }
          }
        });

        if (teamsizeFilterCondition) {
          conditionClause = conditionClause.concat(
            " ",
            `AND (${teamsizeFilterCondition})`
          );
        }
      }
      // Data query
      let dataQuery = `
      SELECT 
      providers.id,
      providers.created_at,
      providers.updated_at,
      providers.avatar,
      providers.company_logo,
      providers.role,
      providers.slug,
      providers.fullname,
      providers.startup_company_name,
      providers.enterprise_company_name,
      GROUP_CONCAT(DISTINCT frg_locations.name) as location,
      GROUP_CONCAT(DISTINCT frg_challenge_sectors.name) as sector,
      COALESCE(solution_count,0) as solutions
      FROM frg_providers AS providers
      INNER JOIN frg_users On providers.frg_user_id = frg_users.id AND frg_users.email_verified = 1
      LEFT JOIN (SELECT frg_solutions.frg_provider_id, COUNT(*) AS solution_count FROM frg_solutions WHERE frg_solutions.status = 'active' GROUP BY frg_solutions.frg_provider_id) frg_solutions ON frg_solutions.frg_provider_id = providers.id
      LEFT JOIN frg_locations_providers ON providers.id = frg_locations_providers.frg_provider_id
      LEFT JOIN frg_locations ON frg_locations_providers.frg_location_id = frg_locations.id
      LEFT JOIN frg_challenge_sectors_providers ON providers.id = frg_challenge_sectors_providers.frg_provider_id
      LEFT JOIN frg_challenge_sectors ON frg_challenge_sectors_providers.frg_challenge_sector_id = frg_challenge_sectors.id
      LEFT JOIN (SELECT frg_solutions.id,frg_solutions.frg_provider_id,frg_challenge_sectors.id as solution_sector_id FROM frg_solutions
        LEFT OUTER JOIN frg_solutions_challenge_sectors ON frg_solutions.id = frg_solutions_challenge_sectors.frg_solution_id
        LEFT OUTER JOIN frg_challenge_sectors ON frg_solutions_challenge_sectors.frg_challenge_sector_id = frg_challenge_sectors.id) solutions ON solutions.frg_provider_id = providers.id 
      WHERE ${conditionClause} GROUP BY providers.id ORDER BY ${OrderByClause} LIMIT ${limit} OFFSET ${offSet};`;
      // Count query
      let countQuery = `
      SELECT COUNT(*) as total_count FROM  (SELECT
        providers.id,
        providers.created_at,
        providers.updated_at,
        providers.avatar,
        providers.company_logo,
        providers.role,
        providers.slug,
        providers.fullname,
        providers.startup_company_name,
        providers.enterprise_company_name,
        GROUP_CONCAT(DISTINCT frg_locations.name) as location,
        GROUP_CONCAT(DISTINCT frg_challenge_sectors.name) as sector,
        COALESCE(solution_count,0) as solutions
        FROM frg_providers AS providers
        INNER JOIN frg_users On providers.frg_user_id = frg_users.id AND frg_users.email_verified = 1
        LEFT JOIN (SELECT frg_solutions.frg_provider_id, COUNT(*) AS solution_count FROM frg_solutions WHERE frg_solutions.status = 'active' GROUP BY frg_solutions.frg_provider_id) frg_solutions ON frg_solutions.frg_provider_id = providers.id
        LEFT JOIN frg_locations_providers ON providers.id = frg_locations_providers.frg_provider_id
        LEFT JOIN frg_locations ON frg_locations_providers.frg_location_id = frg_locations.id
        LEFT JOIN frg_challenge_sectors_providers ON providers.id = frg_challenge_sectors_providers.frg_provider_id
        LEFT JOIN frg_challenge_sectors ON frg_challenge_sectors_providers.frg_challenge_sector_id = frg_challenge_sectors.id
        LEFT JOIN (SELECT frg_solutions.id,frg_solutions.frg_provider_id,frg_challenge_sectors.id as solution_sector_id FROM frg_solutions
          LEFT OUTER JOIN frg_solutions_challenge_sectors ON frg_solutions.id = frg_solutions_challenge_sectors.frg_solution_id
          LEFT OUTER JOIN frg_challenge_sectors ON frg_solutions_challenge_sectors.frg_challenge_sector_id = frg_challenge_sectors.id) solutions ON solutions.frg_provider_id = providers.id
        WHERE ${conditionClause} GROUP BY providers.id) as countQuery`;
      const resultantRecords = await sails.sendNativeQuery(dataQuery, []);
      const totalCount = await sails.sendNativeQuery(countQuery, []);
      res.send({
        status: true,
        msg: "Providers retrieved",
        data: resultantRecords.rows,
        total_records: totalCount.rows[0].total_count,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = searchQueryBuilder(req.body);
      const data = await Providers.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "Providers count retrieved", data: data });
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
      const data = await Providers.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Provider updated", data: data }
          : { status: false, msg: "Provider not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const temp = await Providers.findOne({ id: req.body.slug.id });
      if (!temp)
        return res.send({
          status: false,
          msg: "Provider not found",
          data: temp,
        });
      else {
        rmDir(
          path.join(
            rootDir.toString(),
            "assets",
            "uploads",
            `${Providers.tableName}`,
            `${temp.id}`
          ),
          (err) => {
            if (err) throw err;
            sails.log.info("directory deleted");
          }
        );
        res.send({
          status: true,
          msg: "Provider deleted successfully",
          data: await Providers.destroyOne({ id: temp.id }),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const providers = await Providers.find({
        where: { id: req.body.slug.ids },
      });
      if (providers.length <= 0) {
        return res.send({
          status: false,
          msg: "Providers not found",
          data: providers,
        });
      } else {
        providers.forEach((provider) => {
          rmDir(
            path.join(
              rootDir.toString(),
              "assets",
              "uploads",
              `${Providers.tableName}`,
              `${provider.id}`
            ),
            (err) => {
              if (err) throw err;
              sails.log.info("directory deleted");
            }
          );
        });
        res.send({
          status: true,
          msg: "Providers deleted successfully",
          data: await Providers.destroy({ id: req.body.slug.ids }).fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};

function searchQueryBuilder(input) {
  const queryParams = input;
  let query = {
    condition: {},
    sort: null,
    pagination: {},
  };
  for (let [key, value] of Object.entries(queryParams)) {
    if (key === "slug") Object.assign(query.condition, value);
    else if (key === "filter") Object.assign(query.condition, value);
    else if (key === "search") {
      let searchKey = Object.keys(value);
      let searchVal = Object.values(value);
      let searchQuery = { or: [] };
      searchKey.forEach((key, i) => {
        searchQuery.or.push({ [key]: { contains: searchVal[i] } });
      });
      Object.assign(query.condition, searchQuery);
    } else if (key === "sort") query.sort = value;
    else if (key === "pg") query.pagination = value;
  }
  return query;
}
