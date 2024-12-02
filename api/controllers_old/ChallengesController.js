/**
 * ChallengesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const _ = require("@sailshq/lodash");
const MailEventsController = require("./MailEventsController");

module.exports = {
  create: async (req, res) => {
    const newChallenge = await Challenges.create(req.body.data).fetch();
    try {
      res.send({
        status: true,
        msg: "Challenge created successfully",
        data: newChallenge,
      });
      // trigger email notification for users
      triggerNotificationForNewChallenge(
        await Challenges.findOne({ id: newChallenge.id })
          .populate("frg_challenge_sector_id")
          .populate("anchors")
          .populate("solutions"),
        req
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  selectById: async (req, res) => {
    try {
      const data = await Challenges.findOne({ id: req.body.slug.id })
        .populate("frg_challenge_sector_id")
        .populate("solutions")
        .populate("anchors")
        .populate("smart_city");
      data.solutions = data.solutions.length;
      res.send(
        data
          ? { status: true, msg: "Challenge retrieved", data: data }
          : { status: false, msg: "Challenge not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await Challenges.findOne({ id: req.body.slug.id })
        .populate("frg_challenge_sector_id")
        .populate("anchors")
        .populate("solutions")
        .populate("smart_city");
      res.send(
        data
          ? { status: true, msg: "Challenge retrieved", data: data }
          : { status: false, msg: "Challenge not found", data: data }
      );
      // trigger email notification
      // triggerNotificationForNewChallenge(
      //   await Challenges.findOne({ id: req.body.slug.id })
      //     .populate("frg_challenge_sector_id")
      //     .populate("anchors")
      //     .populate("solutions"),
      //   req
      // );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Challenges.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit || 10,
        skip: query.pagination.skip || 0,
      })
        .populate("frg_challenge_sector_id")
        .populate("anchors")
        .populate("solutions")
        .populate("smart_city");
      res.send(
        data.length > 0
          ? { status: true, msg: "Challenges retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Challenges.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "Challenges count retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Challenges.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Challenge updated", data: data }
          : { status: false, msg: "Challenge not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await Challenges.destroyOne({ id: req.body.slug.id });
      res.send(
        data
          ? { status: true, msg: "Challenge deleted successfully", data: data }
          : { status: false, msg: "Challenge not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await Challenges.destroy({ id: req.body.slug.ids }).fetch();
      res.send(
        data.length > 0
          ? { status: true, msg: "Challenges deleted successfully", data: data }
          : { status: false, msg: "Challenges not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  discoverChallenge: async (req, res) => {
    try {
      const sortBy = req.body.sort || "challenge_name ASC";
      const limit = req.body.pg.limit || 10;
      const offSet = req.body.pg.skip || 0;
      const searchString = req.body.search.name || "";
      let conditionClause = `Challenges.name LIKE '%${searchString}%'`;

      if (req.body.slug.id) {
        conditionClause = conditionClause.concat(
          " ",
          `AND Challenges.id IN (${req.body.slug.id})`
        );
      }

      if (req.body.filter.sector) {
        conditionClause = conditionClause.concat(
          " ",
          `AND Challenges.frg_challenge_sector_id IN (${req.body.filter.sector})`
        );
      }

      if (req.body.filter.by_anchor) {
        let filterClausesArr = req.body.filter.by_anchor;
        let anchorFilterCondition;
        filterClausesArr.forEach((a, i) => {
          if (i === 0) {
            if (a.from === 0) {
              anchorFilterCondition = `COALESCE(anchor_count,0) BETWEEN ${a.from} AND ${a.to}`;
            } else if (a.to === null) {
              anchorFilterCondition = `anchor_count >= ${a.from}`;
            } else {
              anchorFilterCondition = `anchor_count BETWEEN ${a.from} AND ${a.to}`;
            }
          } else {
            if (a.from === 0) {
              anchorFilterCondition = anchorFilterCondition.concat(
                " ",
                `OR COALESCE(anchor_count,0) BETWEEN ${a.from} AND ${a.to}`
              );
            } else if (a.to === null) {
              anchorFilterCondition = anchorFilterCondition.concat(
                " ",
                `OR anchor_count >= ${a.from}`
              );
            } else {
              anchorFilterCondition = anchorFilterCondition.concat(
                " ",
                `OR anchor_count BETWEEN ${a.from} AND ${a.to}`
              );
            }
          }
        });
        if (anchorFilterCondition) {
          conditionClause = conditionClause.concat(
            " ",
            `AND (${anchorFilterCondition})`
          );
        }
      }

      if (req.body.filter.by_solution) {
        let filterClausesArr = req.body.filter.by_solution;
        let solutionFilterCondition;
        filterClausesArr.forEach((s, i) => {
          if (i === 0) {
            if (s.from === 0) {
              solutionFilterCondition = `COALESCE(solution_count,0) BETWEEN ${s.from} AND ${s.to}`;
            } else if (s.to === null) {
              solutionFilterCondition = `solution_count >= ${s.from}`;
            } else {
              solutionFilterCondition = `solution_count BETWEEN ${s.from} AND ${s.to}`;
            }
          } else {
            if (s.from === 0) {
              solutionFilterCondition = solutionFilterCondition.concat(
                " ",
                `OR COALESCE(solution_count,0) BETWEEN ${s.from} AND ${s.to}`
              );
            } else if (s.to === null) {
              solutionFilterCondition = solutionFilterCondition.concat(
                " ",
                `OR solution_count >= ${s.from}`
              );
            } else {
              solutionFilterCondition = solutionFilterCondition.concat(
                " ",
                `OR solution_count BETWEEN ${s.from} AND ${s.to}`
              );
            }
          }
        });

        if (solutionFilterCondition) {
          conditionClause = conditionClause.concat(
            " ",
            `AND (${solutionFilterCondition})`
          );
        }
      }

      if (req.body.filter.by_anchor_id) {
        conditionClause = conditionClause.concat(
          " ",
          `AND frg_anchors.id IN (${req.body.filter.by_anchor_id})`
        );
      }

      let dataQuery = `   
      SELECT
      Challenges.id,
      Challenges.created_at,
      Challenges.updated_at,
      Challenges.name as challenge_name,
      sectors.name as sector_name,
      COALESCE(anchor_count,0) as anchors,
      COALESCE(solution_count,0) as solutions
      FROM frg_challenges AS Challenges
      LEFT JOIN frg_challenge_sectors AS sectors ON Challenges.frg_challenge_sector_id = sectors.id
      LEFT JOIN (SELECT frg_anchors.frg_challenge_id, COUNT(*) AS anchor_count FROM frg_anchors WHERE frg_anchors.status = 'active' GROUP BY frg_anchors.frg_challenge_id) anchors_count ON anchors_count.frg_challenge_id = Challenges.id
      LEFT JOIN (SELECT *, COUNT(*) AS solution_count FROM frg_solutions_challenges GROUP BY frg_solutions_challenges.frg_challenge_id) frg_solutions_challenges ON frg_solutions_challenges.frg_challenge_id = Challenges.id
      LEFT JOIN frg_anchors ON frg_anchors.frg_challenge_id = Challenges.id AND frg_anchors.status = 'active'
      WHERE ${conditionClause} GROUP BY Challenges.id ORDER BY ${sortBy} LIMIT ${limit} OFFSET ${offSet}`;
      // count query
      let countQuery = `
      SELECT COUNT(*) as total_count FROM (SELECT
        Challenges.id,
        Challenges.created_at,
        Challenges.updated_at,
        Challenges.name as challenge_name,
        sectors.name as sector_name
        FROM frg_challenges AS Challenges
        LEFT JOIN frg_challenge_sectors AS sectors ON Challenges.frg_challenge_sector_id = sectors.id
        LEFT JOIN (SELECT frg_anchors.frg_challenge_id, COUNT(*) AS anchor_count FROM frg_anchors WHERE frg_anchors.status = 'active' GROUP BY frg_anchors.frg_challenge_id) anchors_count ON anchors_count.frg_challenge_id = Challenges.id
        LEFT JOIN (SELECT *, COUNT(*) AS solution_count FROM frg_solutions_challenges GROUP BY frg_solutions_challenges.frg_challenge_id) frg_solutions_challenges ON frg_solutions_challenges.frg_challenge_id = Challenges.id
        LEFT JOIN frg_anchors ON frg_anchors.frg_challenge_id = Challenges.id AND frg_anchors.status = 'active'
        WHERE ${conditionClause} GROUP BY Challenges.id) as countQuery`;
      const resultantRecords = await sails.sendNativeQuery(dataQuery, []);
      const totalCount = await sails.sendNativeQuery(countQuery, []);
      res.send({
        status: true,
        msg: "Challenges retrieved",
        data: resultantRecords.rows,
        total_records: totalCount.rows[0].total_count,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};

function anchorsolutionFilter(
  solutionCount,
  solutionRange,
  anchorCount,
  anchorRange
) {
  let solutionResult = false;
  let anchorResult = false;
  if (solutionRange && "from" in solutionRange && "to" in solutionRange) {
    if (
      solutionCount >= solutionRange.from &&
      solutionCount <= solutionRange.to
    ) {
      solutionResult = true;
    } else solutionResult = false;
  } else {
    solutionResult = false;
  }
  if (anchorRange && "from" in anchorRange && "to" in anchorRange) {
    if (anchorCount >= anchorRange.from && anchorCount <= anchorRange.to) {
      anchorResult = true;
    } else anchorResult = false;
  } else {
    anchorResult = false;
  }
  return { solutionResult, anchorResult };
}

// notificaiton fuctions
async function triggerNotificationForNewChallenge(challengeData, req) {
  // send notification for provider
  const providerIdBasedOnSector = await ChallengesectorsProviders.find({
    frg_challenge_sector_id: challengeData.frg_challenge_sector_id.id,
  });
  const protocol = req.connection.encrypted ? "https" : "http";
  const baseUrl = protocol + "://" + req.headers.host;
  providerIdBasedOnSector.forEach(async (e) => {
    const providerData = await Providers.findOne({ id: e.frg_provider_id })
      .populate("frg_user_id")
      .populate("frg_smart_city_id")
      .populate("challenge_sectors");
    MailEventsController.onNewChallengeCreation({
      user_name: providerData.fullname.split(" ")[0],
      avatar: `${baseUrl + providerData.avatar}`,
      email: providerData.frg_user_id.email,
      challenge_name: challengeData.name,
      solution_count: challengeData.solutions.length,
      application_count: challengeData.anchors.length,
      challenge_sector: challengeData.frg_challenge_sector_id.name,
      challenge_url: `${sails.config.globals.front_end_url}/challenge/${challengeData.id}`,
    });
  });
  // send notification for seeker
  const seekerIdBasedOnSector = await ChallengesectorsSeekers.find({
    frg_challenge_sector_id: challengeData.frg_challenge_sector_id.id,
  });
  seekerIdBasedOnSector.forEach(async (e) => {
    const seekerData = await Seekers.findOne({ id: e.frg_seeker_id })
      .populate("frg_user_id")
      .populate("frg_smart_city_id")
      .populate("challenge_sectors");
    MailEventsController.onNewChallengeCreation({
      user_name: seekerData.fullname.split(" ")[0],
      avatar: `${baseUrl + seekerData.avatar}`,
      email: seekerData.frg_user_id.email,
      challenge_name: challengeData.name,
      challenge_sector: challengeData.frg_challenge_sector_id.name,
      challenge_url: `${sails.config.globals.front_end_url}/challenge/${challengeData.id}`,
    });
  });
}
