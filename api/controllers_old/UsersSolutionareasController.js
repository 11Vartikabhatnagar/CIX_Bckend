/**
 * UsersSolutionareasController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


    create: async (req, res) => {
        try {
            res.send({
                status: true,
                msg: "user solution associated",
                data: await UsersSolutionareas.create(req.body).fetch()
            })
        } catch (err) {
            if (err && err.code === 'E_UNIQUE')
                return res.status(409).send({ status: false, msg: 'already exists!', data: err });
            else if (err && err.name === 'UsageError')
                return res.badRequest({ status: false, msg: 'Invalid request format', data: err });
            else if (err)
                return res.serverError({ status: false, msg: 'Internal server error', data: err });
        }
    },

    select: async (req, res) => {
        try {
            const data = await UsersSolutionareas.findOne(req.body);
            res.send(
                data ?
                    ({ status: true, msg: 'Solution retrieved', data: data }) :
                    ({ status: false, msg: 'Solution not found', data: data })
            );
        } catch (err) {
            if (err && err.name === 'UsageError')
                return res.badRequest({ status: false, msg: 'Invalid request format', data: err });
            else if (err)
                return res.serverError({ status: false, msg: 'Internal server error', data: err });
        }
    },

    delete: async (req, res) => {
        try {
            const data = await UsersSolutionareas.findOne(req.body);
            if (!data)
                return res.send({ status: false, msg: 'Solution not found', data: [] });
            else
                res.send({
                    status: true,
                    msg: 'Solution deleted',
                    data: await UsersSolutionareas.destroyOne(req.body)
                });
        } catch (err) {
            if (err && err.name === 'UsageError')
                return res.badRequest({ status: false, msg: 'Invalid request format', data: err });
            else if (err)
                return res.serverError({ status: false, msg: 'Internal server error', data: err });
        }
    },

};

