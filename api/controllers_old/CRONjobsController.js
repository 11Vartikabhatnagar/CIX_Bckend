/**
 * CRONjobsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require("moment");
const rmDir = require("rimraf");
const path = require("path");
const rootDir = sails.config.appPath;

module.exports = {
  killUnVerifiedUsers: async (req, res) => {
    try {
      const unVerifiedUsers = await Users.find({ email_verified: false })
        .populate("seeker")
        .populate("provider");
      unVerifiedUsers.forEach(async (user) => {
        let userCreatedAt = moment(user.created_at);
        let daysOld = moment().diff(userCreatedAt, "days");
        //   delete accounct if not activated morethan 7 days
        if (daysOld >= 7) {
          if (user.role_seeker && user.seeker.length) {
            // delete seeker
          }
          if (user.role_provider && user.provider.length) {
            let provider = user.provider[0];
            //delete provider
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
            await Providers.destroyOne({ id: provider.id });
          }
          //   and finally deleting the user account
          await Users.destroyOne({ id: user.id });
        }
      });
      res.send({
        status: true,
        msg: "Unverfied users deleted successfully",
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
};
