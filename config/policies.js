/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  UsersController: {
    select: "CheckAuth",
    delete: "CheckAuth",
    delete_mul: "CheckAuth",
    changePassword: "CheckAuth",
    submitContactForm: "CheckAuth",
  },
  ProvidersController: {
    discoverProviders: "CheckAuth",
    searchSuggestions: "CheckAuth",
    delete: "CheckAuth",
    delete_mul: "CheckAuth",
    removeAvatar: "CheckAuth",
    reject: "CheckAuth",
    approve: "CheckAuth",
    archive: "CheckAuth",
  },
  SeekersController: {
    delete: "CheckAuth",
    delete_mul: "CheckAuth",
    removeAvatar: "CheckAuth",
    reject: "CheckAuth",
    approve: "CheckAuth",
    archive: "CheckAuth",
  },
  ChallengesController: {
    create: "CheckAuth",
    discoverChallenge: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
    selectById: "CheckAuth",
  },
  ChallengeSectorsController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  LocationsController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  LocationsProvidersController: {
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  LocationsSeekersController: {
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  ChallengeSmartCityController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  ChallengesectorsProvidersController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  ChallengesectorsSeekersController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  SmartCitiesController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
    uploadCityLogo: "CheckAuth",
    updateCEOAvatar: "CheckAuth",
    removeAvatar: "CheckAuth",
    uploadCityMap: "CheckAuth",
    uploadCityGallery: "CheckAuth",
    removeFromGallery: "CheckAuth",
  },
  AuthController: {
    authCheck: "CheckAuth",
  },
  SolutionsController: {
    create: "CheckAuth",
    imageUpload: "CheckAuth",
    removeFromImages: "CheckAuth",
    addToImages: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
    discoverSolutions: "CheckAuth",
    pushNewSolutionNotification: "CheckAuth",
    relatedSolutions: "CheckAuth",
  },
  SolutionsSmartCitiesController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  SolutionsChallengeSectorsController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  SolutionsChallengesController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  SmartCityChallengeSectorController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    delete_mul: "CheckAuth",
  },
  AnchorsController: {
    create: "CheckAuth",
    delete: "CheckAuth",
    update: "CheckAuth",
    pushNewAnchorNotification: "CheckAuth",
    pushAnchorClosedNotification: "CheckAuth",
    select: "CheckAuth",
    select_mul: "CheckAuth",
  },
};
