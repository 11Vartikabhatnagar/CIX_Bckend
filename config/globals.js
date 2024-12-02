/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on any of these options, check out:
 * https://sailsjs.com/config/globals
 */

module.exports.globals = {
  /****************************************************************************
   *                                                                           *
   * Whether to expose the locally-installed Lodash as a global variable       *
   * (`_`), making  it accessible throughout your app.                         *
   *                                                                           *
   ****************************************************************************/

  _: require("@sailshq/lodash"),

  /****************************************************************************
   *                                                                           *
   * This app was generated without a dependency on the "async" NPM package.   *
   *                                                                           *
   * > Don't worry!  This is totally unrelated to JavaScript's "async/await".  *
   * > Your code can (and probably should) use `await` as much as possible.    *
   *                                                                           *
   ****************************************************************************/

  async: false,

  /****************************************************************************
   *                                                                           *
   * Whether to expose each of your app's models as global variables.          *
   * (See the link at the top of this file for more information.)              *
   *                                                                           *
   ****************************************************************************/

  models: true,

  /****************************************************************************
   *                                                                           *
   * Whether to expose the Sails app instance as a global variable (`sails`),  *
   * making it accessible throughout your app.                                 *
   *                                                                           *
   ****************************************************************************/

  sails: true,

  ACCESS_TOKEN_SECRET:
    "b2c312295495ce507ad73de8961b83d8075d2cd0e391f35b6537be983eb87c872a1444a86cc69ac9020fea19c4c361921487e443c0ee65a5",
  REFRESH_TOKEN_SECRET:
    "32f5d071588876e9a7f2a8703ec7574e3f8d13cce718317c513eb4e68ef7a8b37eca2c2080c6acfdf2f0167a1165b1b4e9641f376dcfc9e4",
  default_assets: {
    avatar: "/defaults/default-avatar.png",
    default_img: "/defaults/default-img.png",
  },
  SG_API_TOKEN:
    "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",
  front_end_url: "http://cityinxstaging.excrin.com",
};
