/**
 * ProviderfieldsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


    create: async (req, res) => {
        try {
            res.send({
                status: true,
                msg: 'Provider fields created',
                data: await Providerfields.create(req.body).fetch()
            })
        } catch (error) {
            if (err && err.name === 'UsageError')
                return res.badRequest({ status: false, msg: 'Invalid request format', data: err });
            else if (err)
                return res.serverError({ status: false, msg: 'Internal server error', data: err });
        }
    },

    select: async (req, res) => {
        try {
            const data = await Providerfields.findOne(req.body);
            res.send(
                data ?
                    ({ status: true, msg: 'provider fields retrieved', data: data }) :
                    ({ status: false, msg: 'provider fields not found', data: data })
            );
        } catch (err) {
            if (err && err.name === 'UsageError')
                return res.badRequest({ status: false, msg: 'Invalid request format', data: err });
            else if (err)
                return res.serverError({ status: false, msg: 'Internal server error', data: err });
        }
    },

    select_mul: async (req, res) => {
        const query = req.body;
        console.log(query.slug)
        try {
            const data = await Providerfields.find({
                where: query.slug ? query.slug : {},
                sort: query.sort ? query.sort : {},
                limit: query.pg.limit ? query.pg.limit : 10,
                skip: query.pg.skip ? query.pg.skip : 0
            });
            res.send({ status: true, msg: 'data retrieved', data: data });
        }
        catch (error) {
            res.send({ status: false, msg: 'Cannot retrieve data', data: error });
        }

    },

    update: async (req, res) => {
        try {

            const data = await Providerfields.updateOne({ where: { id: req.body.slug } }).set(req.body);
            if (data)
                res.send({
                    status: true,
                    msg: 'provider fields updated',
                    data: data
                })
            else
                res.send({
                    status: true,
                    msg: 'provider fields not found',
                    data: data
                })

        } catch (err) {
            if (err && err.name === 'UsageError')
                return res.badRequest({ status: false, msg: 'Invalid request format', data: err });
            else if (err)
                return res.serverError({ status: false, msg: 'Internal server error', data: err });
        }
    },

    delete: async (req, res) => {
        try {
            const data = await Providerfields.findOne(req.body);
            if (!data)
                return res.send({ status: false, msg: 'provider fields not found', data: [] });
            else
                res.send({
                    status: true,
                    msg: 'provider fields deleted',
                    data: await Providerfields.destroyOne(req.body)
                });
        } catch (err) {
            if (err && err.name === 'UsageError')
                return res.badRequest({ status: false, msg: 'Invalid request format', data: err });
            else if (err)
                return res.serverError({ status: false, msg: 'Internal server error', data: err });
        }
    },

};

