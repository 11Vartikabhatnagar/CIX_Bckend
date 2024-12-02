/**
 * SolutionsChallengeSectorsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    create: async (req, res) => {
        try {
            res.send({
                status: true,
                msg: "Solution Challenge Sector association created",
                data: await SolutionsChallengeSectors.create(req.body.data).fetch(),
            });
        } catch (err) {
            await sails.helpers.errorHandler(res, err);
        }
    },

    select: async (req, res) => {
        try {
            const data = await SolutionsChallengeSectors.findOne({
                id: req.body.slug.id,
            });
            res.send(
                data
                    ? {
                        status: true,
                        msg: "Solution Challenge Sector association retrieved",
                        data: data,
                    }
                    : {
                        status: false,
                        msg: "Solution Challenge Sector association not found",
                        data: data,
                    }
            );
        } catch (err) {
            await sails.helpers.errorHandler(res, err);
        }
    },

    select_mul: async (req, res) => {
        try {
            const query = await sails.helpers.selectQueryBuilder(req.body);
            const data = await SolutionsChallengeSectors.find({
                where: query.condition,
                sort: query.sort || "created_at DESC",
                limit: query.pagination.limit,
                skip: query.pagination.skip,
            });
            res.send(
                data.length > 0
                    ? {
                        status: true,
                        msg: "Solution Challenge Sector association retrieved",
                        data: data,
                    }
                    : { status: false, msg: "No records found", data: data }
            );
        } catch (err) {
            await sails.helpers.errorHandler(res, err);
        }
    },

    count: async (req, res) => {
        try {
            const query = await sails.helpers.selectQueryBuilder(req.body);
            const data = await SolutionsChallengeSectors.count({
                where: query.condition,
            });
            res.send({
                status: true,
                msg: "Solution Challenge Sector association count retrieved",
                data: data,
            });
        } catch (err) {
            await sails.helpers.errorHandler(res, err);
        }
    },

    update: async (req, res) => {
        try {
            const data = await SolutionsChallengeSectors.updateOne({
                where: { id: req.body.slug.id },
            }).set(req.body.data);
            res.send(
                data
                    ? {
                        status: true,
                        msg: "Solution Challenge Sector association updated",
                        data: data,
                    }
                    : {
                        status: false,
                        msg: "Solution Challenge Sector association not found",
                        data: data,
                    }
            );
        } catch (err) {
            await sails.helpers.errorHandler(res, err);
        }
    },

    delete: async (req, res) => {
        try {
            const data = await SolutionsChallengeSectors.destroyOne({
                id: req.body.slug.id,
            });
            res.send(
                data
                    ? {
                        status: true,
                        msg:
                            "Solution Challenge Sector association deleted successfully",
                        data: data,
                    }
                    : {
                        status: false,
                        msg: "Solution Challenge Sector association not found",
                        data: data,
                    }
            );
        } catch (err) {
            await sails.helpers.errorHandler(res, err);
        }
    },

    delete_mul: async (req, res) => {
        try {
            const data = await SolutionsChallengeSectors.destroy({
                id: req.body.slug.ids.length > 0 ? req.body.slug.ids : [0],
            }).fetch();
            res.send(
                data.length > 0
                    ? {
                        status: true,
                        msg:
                            "Solution Challenge Sector associations deleted successfully",
                        data: data,
                    }
                    : {
                        status: false,
                        msg: "Solution Challenge Sector associations not found",
                        data: data,
                    }
            );
        } catch (err) {
            await sails.helpers.errorHandler(res, err);
        }
    },
};

