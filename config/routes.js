/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  // Users
  "POST /api/v1/users/create": "UsersController.signUp",
  "POST /api/v1/users/verify": "UsersController.verifyEmailOTP",
  "POST /api/v1/users/select": "UsersController.select",
  "POST /api/v1/users/select_mul": "UsersController.select_mul",
  "POST /api/v1/users/count": "UsersController.count",
  "POST /api/v1/users/update": "UsersController.update",
  "POST /api/v1/users/delete": "UsersController.delete",
  "POST /api/v1/users/delete_mul": "UsersController.delete_mul",
  "POST /api/v1/users/login": "UsersController.login",
  "POST /api/v1/users/change_password": "UsersController.changePassword",
  "POST /api/v1/users/send_verification_code_password":
    "UsersController.resetPasswordSendVerificationCode",
  "POST /api/v1/users/verify_password_reset_code":
    "UsersController.verifyResetCode",
  "POST /api/v1/users/reset_password": "UsersController.resetPassword",
  "POST /api/v1/users/resend_verification_code":
    "UsersController.resendVerificationCodeForActivation",
  "POST /api/v1/users/submit_contact_form": "UsersController.submitContactForm",

  // admins
  "POST /api/v1/admin/create": "AdminController.create",
  "POST /api/v1/admin/select_by_id": "AdminController.select",
  "POST /api/v1/admin/login": "AuthController.adminLogin",
  "POST /api/v1/admin/refresh_token": "AuthController.refreshTokenAdmin",
  "POST /api/v1/admin/record_count": "AdminController.countService",

  // Challenge Sectors
  "POST /api/v1/challenge_sectors/create": "ChallengeSectorsController.create",
  "POST /api/v1/challenge_sectors/upload":
    "ChallengeSectorsController.updateAvatar",
  "POST /api/v1/challenge_sectors/remove_avatar":
    "ChallengeSectorsController.removeAvatar",
  "POST /api/v1/challenge_sectors/select": "ChallengeSectorsController.select",
  "POST /api/v1/challenge_sectors/select_mul":
    "ChallengeSectorsController.select_mul",
  "POST /api/v1/challenge_sectors/count": "ChallengeSectorsController.count",
  "POST /api/v1/challenge_sectors/update": "ChallengeSectorsController.update",
  "POST /api/v1/challenge_sectors/delete": "ChallengeSectorsController.delete",
  "POST /api/v1/challenge_sectors/delete_mul":
    "ChallengeSectorsController.delete_mul",

  // Seekers
  "POST /api/v1/seekers/create": "SeekersController.create",
  "POST /api/v1/seekers/upload": "SeekersController.updateAvatar",
  "POST /api/v1/seekers/remove_avatar": "SeekersController.removeAvatar",
  "POST /api/v1/seekers/select_slug": "SeekersController.selectById",
  "POST /api/v1/seekers/select": "SeekersController.select",
  "POST /api/v1/seekers/select_mul": "SeekersController.select_mul",
  "POST /api/v1/seekers/count": "SeekersController.count",
  "POST /api/v1/seekers/update": "SeekersController.update",
  "POST /api/v1/seekers/delete": "SeekersController.delete",
  "POST /api/v1/seekers/delete_mul": "SeekersController.delete_mul",
  "POST /api/v1/seekers/approve": "SeekersController.approve",
  "POST /api/v1/seekers/reject": "SeekersController.reject",
  "POST /api/v1/seekers/archive": "SeekersController.archive",

  // Providers
  "POST /api/v1/providers/create": "ProvidersController.create",
  "POST /api/v1/providers/upload": "ProvidersController.updateAvatar",
  "POST /api/v1/providers/remove_avatar": "ProvidersController.removeAvatar",
  "POST /api/v1/providers/company_logo": "ProvidersController.companyLogo",
  "POST /api/v1/providers/select_slug": "ProvidersController.selectById",
  "POST /api/v1/providers/select": "ProvidersController.select",
  "POST /api/v1/providers/select_mul": "ProvidersController.select_mul",
  "POST /api/v1/providers/count": "ProvidersController.count",
  "POST /api/v1/providers/update": "ProvidersController.update",
  "POST /api/v1/providers/delete": "ProvidersController.delete",
  "POST /api/v1/providers/delete_mul": "ProvidersController.delete_mul",
  "POST /api/v1/providers/discover": "ProvidersController.discoverProviders",
  "POST /api/v1/providers/search_auto_suggestions":
    "ProvidersController.searchSuggestions",
  "POST /api/v1/providers/approve": "ProvidersController.approve",
  "POST /api/v1/providers/reject": "ProvidersController.reject",
  "POST /api/v1/providers/archive": "ProvidersController.archive",

  // Locations
  "POST /api/v1/locations/create": "LocationsController.create",
  "POST /api/v1/locations/select": "LocationsController.select",
  "POST /api/v1/locations/list": "LocationsController.list",
  "POST /api/v1/locations/select_mul": "LocationsController.select_mul",
  "POST /api/v1/locations/count": "LocationsController.count",
  "POST /api/v1/locations/update": "LocationsController.update",
  "POST /api/v1/locations/delete": "LocationsController.delete",
  "POST /api/v1/locations/delete_mul": "LocationsController.delete_mul",

  // Locations & Provider
  "POST /api/v1/locations_and_providers/create":
    "LocationsProvidersController.create",
  "POST /api/v1/locations_and_providers/select":
    "LocationsProvidersController.select",
  "POST /api/v1/locations_and_providers/select_mul":
    "LocationsProvidersController.select_mul",
  "POST /api/v1/locations_and_providers/count":
    "LocationsProvidersController.count",
  "POST /api/v1/locations_and_providers/update":
    "LocationsProvidersController.update",
  "POST /api/v1/locations_and_providers/delete":
    "LocationsProvidersController.delete",
  "POST /api/v1/locations_and_providers/delete_mul":
    "LocationsProvidersController.delete_mul",

  // Locations & Provider
  "POST /api/v1/locations_and_seekers/create":
    "LocationsSeekersController.create",
  "POST /api/v1/locations_and_seekers/select":
    "LocationsSeekersController.select",
  "POST /api/v1/locations_and_seekers/select_mul":
    "LocationsSeekersController.select_mul",
  "POST /api/v1/locations_and_seekers/count":
    "LocationsSeekersController.count",
  "POST /api/v1/locations_and_seekers/update":
    "LocationsSeekersController.update",
  "POST /api/v1/locations_and_seekers/delete":
    "LocationsSeekersController.delete",
  "POST /api/v1/locations_and_seekers/delete_mul":
    "LocationsSeekersController.delete_mul",

  // Challenge sectors & Provider
  "POST /api/v1/challenge_sectors_and_providers/create":
    "ChallengesectorsProvidersController.create",
  "POST /api/v1/challenge_sectors_and_providers/create_mul":
    "ChallengesectorsProvidersController.create_mul",
  "POST /api/v1/challenge_sectors_and_providers/select":
    "ChallengesectorsProvidersController.select",
  "POST /api/v1/challenge_sectors_and_providers/select_mul":
    "ChallengesectorsProvidersController.select_mul",
  "POST /api/v1/challenge_sectors_and_providers/count":
    "ChallengesectorsProvidersController.count",
  "POST /api/v1/challenge_sectors_and_providers/update":
    "ChallengesectorsProvidersController.update",
  "POST /api/v1/challenge_sectors_and_providers/delete":
    "ChallengesectorsProvidersController.delete",
  "POST /api/v1/challenge_sectors_and_providers/delete_mul":
    "ChallengesectorsProvidersController.delete_mul",

  // Challenge sectors & Seekers
  "POST /api/v1/challenge_sectors_seekers/create":
    "ChallengesectorsSeekersController.create",
  "POST /api/v1/challenge_sectors_seekers/create_mul":
    "ChallengesectorsSeekersController.create_mul",
  "POST /api/v1/challenge_sectors_seekers/select":
    "ChallengesectorsSeekersController.select",
  "POST /api/v1/challenge_sectors_seekers/select_mul":
    "ChallengesectorsSeekersController.select_mul",
  "POST /api/v1/challenge_sectors_seekers/count":
    "ChallengesectorsSeekersController.count",
  "POST /api/v1/challenge_sectors_seekers/update":
    "ChallengesectorsSeekersController.update",
  "POST /api/v1/challenge_sectors_seekers/delete":
    "ChallengesectorsSeekersController.delete",
  "POST /api/v1/challenge_sectors_seekers/delete_mul":
    "ChallengesectorsSeekersController.delete_mul",

  // Smart Cities
  "POST /api/v1/smart_cities/create": "SmartCitiesController.create",
  "POST /api/v1/smart_cities/upload": "SmartCitiesController.updateAvatar",
  "POST /api/v1/smart_cities/upload_logo":
    "SmartCitiesController.uploadCityLogo",
  "POST /api/v1/smart_cities/upload_ceo_avatar":
    "SmartCitiesController.updateCEOAvatar",
  "POST /api/v1/smart_cities/remove_avatar":
    "SmartCitiesController.removeAvatar",
  "POST /api/v1/smart_cities/city_map": "SmartCitiesController.uploadCityMap",
  "POST /api/v1/smart_cities/upload_gallery":
    "SmartCitiesController.uploadCityGallery",
  "POST /api/v1/smart_cities/remove_from_gallery":
    "SmartCitiesController.removeFromGallery",
  "POST /api/v1/smart_cities/add_to_gallery":
    "SmartCitiesController.addToGallery",
  "POST /api/v1/smart_cities/select": "SmartCitiesController.selectById",
  "POST /api/v1/smart_cities/list": "SmartCitiesController.list",
  "POST /api/v1/smart_cities/select_mul": "SmartCitiesController.select_mul",
  "POST /api/v1/smart_cities/count": "SmartCitiesController.count",
  "POST /api/v1/smart_cities/update": "SmartCitiesController.update",
  "POST /api/v1/smart_cities/delete": "SmartCitiesController.delete",
  "POST /api/v1/smart_cities/delete_mul": "SmartCitiesController.delete_mul",

  // Challenges
  "POST /api/v1/challenges/create": "ChallengesController.create",
  "POST /api/v1/challenges/select": "ChallengesController.select",
  "POST /api/v1/challenges/select_mul": "ChallengesController.select_mul",
  "POST /api/v1/challenges/count": "ChallengesController.count",
  "POST /api/v1/challenges/update": "ChallengesController.update",
  "POST /api/v1/challenges/delete": "ChallengesController.delete",
  "POST /api/v1/challenges/delete_mul": "ChallengesController.delete_mul",
  "POST /api/v1/challenges/discover": "ChallengesController.discoverChallenge",
  "POST /api/v1/challenges/select_by_id": "ChallengesController.selectById",
  // "POST /api/v1/challenges/test_discover":
  //   "ChallengesController.rawqueryDiscover",

  // Challenges & Smart Cities
  "POST /api/v1/challenges_and_smart_cities/create":
    "ChallengeSmartCityController.create",
  "POST /api/v1/challenges_and_smart_cities/select":
    "ChallengeSmartCityController.select",
  "POST /api/v1/challenges_and_smart_cities/select_mul":
    "ChallengeSmartCityController.select_mul",
        "POST /api/v1/challenges_and_smart_cities/select_mul_2":
    "ChallengeSmartCityController.select_mul_with_chall_association",
  "POST /api/v1/challenges_and_smart_cities/count":
    "ChallengeSmartCityController.count",
  "POST /api/v1/challenges_and_smart_cities/update":
    "ChallengeSmartCityController.update",
  "POST /api/v1/challenges_and_smart_cities/delete":
    "ChallengeSmartCityController.delete",
  "POST /api/v1/challenges_and_smart_cities/delete_mul":
    "ChallengeSmartCityController.delete_mul",

  // Anchors
  "POST /api/v1/anchors/create": "AnchorsController.create",
  "POST /api/v1/anchors/select": "AnchorsController.select",
  "POST /api/v1/anchors/select_mul": "AnchorsController.select_mul",
  "POST /api/v1/anchors/count": "AnchorsController.count",
  "POST /api/v1/anchors/update": "AnchorsController.update",
  "POST /api/v1/anchors/delete": "AnchorsController.delete",
  "POST /api/v1/anchors/delete_mul": "AnchorsController.delete_mul",
  "POST /api/v1/anchors/new_anchor_notification":
    "AnchorsController.pushNewAnchorNotification",
  "POST /api/v1/anchors/close_anchor_notification":
    "AnchorsController.pushAnchorClosedNotification",
    "POST /api/v1/anchors/update_anchor_push_to_city_admin":
    "AnchorsController.update_anchor_push_to_city_admin",


  // Anchors & Smart Cities
  "POST /api/v1/anchors_and_smart_cities/create":
    "AnchorsSmartCitiesController.create",
  "POST /api/v1/anchors_and_smart_cities/select":
    "AnchorsSmartCitiesController.select",
  "POST /api/v1/anchors_and_smart_cities/select_mul":
    "AnchorsSmartCitiesController.select_mul",
  "POST /api/v1/anchors_and_smart_cities/count":
    "AnchorsSmartCitiesController.count",
  "POST /api/v1/anchors_and_smart_cities/update":
    "AnchorsSmartCitiesController.update",
  "POST /api/v1/anchors_and_smart_cities/delete":
    "AnchorsSmartCitiesController.delete",
  "POST /api/v1/anchors_and_smart_cities/delete_mul":
    "AnchorsSmartCitiesController.delete_mul",

  // Solutions
  "POST /api/v1/solutions/create": "SolutionsController.create",
  "POST /api/v1/solutions/uploads": "SolutionsController.imageUpload",
  "POST /api/v1/solutions/remove_from_images":
    "SolutionsController.removeFromImages",
  "POST /api/v1/solutions/add_to_images": "SolutionsController.addToImages",
  "POST /api/v1/solutions/select": "SolutionsController.select",
  "POST /api/v1/solutions/select_mul": "SolutionsController.select_mul",
  "POST /api/v1/solutions/count": "SolutionsController.count",
  "POST /api/v1/solutions/update": "SolutionsController.update",
  "POST /api/v1/solutions/delete": "SolutionsController.delete",
  "POST /api/v1/solutions/delete_mul": "SolutionsController.delete_mul",
  "POST /api/v1/solutions/discover": "SolutionsController.discoverSolutions",
  "POST /api/v1/solutions/related": "SolutionsController.relatedSolutions",
  "POST /api/v1/solutions/new_solution_notification":
    "SolutionsController.pushNewSolutionNotification",

  // Solutions & Smart Cities
  "POST /api/v1/smart_cities_and_solutions/create":
    "SolutionsSmartCitiesController.create",
  "POST /api/v1/smart_cities_and_solutions/select":
    "SolutionsSmartCitiesController.select",
  "POST /api/v1/smart_cities_and_solutions/select_mul":
    "SolutionsSmartCitiesController.select_mul",
  "POST /api/v1/smart_cities_and_solutions/count":
    "SolutionsSmartCitiesController.count",
  "POST /api/v1/smart_cities_and_solutions/update":
    "SolutionsSmartCitiesController.update",
  "POST /api/v1/smart_cities_and_solutions/delete":
    "SolutionsSmartCitiesController.delete",
  "POST /api/v1/smart_cities_and_solutions/delete_mul":
    "SolutionsSmartCitiesController.delete_mul",

  // Solutions & Challenge Sectors
  "POST /api/v1/solutions_challenge_sectors/create":
    "SolutionsChallengeSectorsController.create",
  "POST /api/v1/solutions_challenge_sectors/select":
    "SolutionsChallengeSectorsController.select",
  "POST /api/v1/solutions_challenge_sectors/select_mul":
    "SolutionsChallengeSectorsController.select_mul",
  "POST /api/v1/solutions_challenge_sectors/count":
    "SolutionsChallengeSectorsController.count",
  "POST /api/v1/solutions_challenge_sectors/update":
    "SolutionsChallengeSectorsController.update",
  "POST /api/v1/solutions_challenge_sectors/delete":
    "SolutionsChallengeSectorsController.delete",
  "POST /api/v1/solutions_challenge_sectors/delete_mul":
    "SolutionsChallengeSectorsController.delete_mul",

  // Solutions & Challenge Sectors
  "POST /api/v1/solutions_challenges/create":
    "SolutionsChallengesController.create",
  "POST /api/v1/solutions_challenges/select":
    "SolutionsChallengesController.select",
  "POST /api/v1/solutions_challenges/select_mul":
    "SolutionsChallengesController.select_mul",
  "POST /api/v1/solutions_challenges/count":
    "SolutionsChallengesController.count",
  "POST /api/v1/solutions_challenges/update":
    "SolutionsChallengesController.update",
  "POST /api/v1/solutions_challenges/delete":
    "SolutionsChallengesController.delete",
  "POST /api/v1/solutions_challenges/delete_mul":
    "SolutionsChallengesController.delete_mul",

  // EOI
  "POST /api/v1/eoi/create": "EOIController.create",
  "POST /api/v1/eoi/select": "EOIController.select",
  "POST /api/v1/eoi/select_mul": "EOIController.select_mul",
  "POST /api/v1/eoi/count": "EOIController.count",
  "POST /api/v1/eoi/update": "EOIController.update",
  "POST /api/v1/eoi/delete": "EOIController.delete",
  "POST /api/v1/eoi/delete_mul": "EOIController.delete_mul",

  // Proposal
  "POST /api/v1/proposal/create": "ProposalController.create",
  "POST /api/v1/proposal/select": "ProposalController.select",
  "POST /api/v1/proposal/select_mul": "ProposalController.select_mul",
  "POST /api/v1/proposal/count": "ProposalController.count",
  "POST /api/v1/proposal/update": "ProposalController.update",
  "POST /api/v1/proposal/delete": "ProposalController.delete",
  "POST /api/v1/proposal/delete_mul": "ProposalController.delete_mul",
  "POST /api/v1/proposal/upload_pilot_docs":
    "ProposalController.pilotDocUpload",
  "POST /api/v1/proposal/addto_pilot_docs":
    "ProposalController.addToPastPilotUpload",
  "POST /api/v1/proposal/remove_pilot_docs":
    "ProposalController.removeFromPilotDoc",
  "POST /api/v1/proposal/upload_additional_docs":
    "ProposalController.additionalDocUpload",
  "POST /api/v1/proposal/remove_additional_docs":
    "ProposalController.removeFromAdditionalDoc",
  "POST /api/v1/proposal/addto_additional_docs":
    "ProposalController.addToAdditionalUpload",
  "POST /api/v1/proposal/upload_pilot_order":
    "ProposalController.pilotOrderUpload",
  "POST /api/v1/proposal/addto_pilot_order":
    "ProposalController.addToPilotOrderUpload",
  "POST /api/v1/proposal/remove_pilot_order":
    "ProposalController.removeFromPilotOrderUpload",
  "POST /api/v1/proposal/upload_pilot_report":
    "ProposalController.pilotReportUpload",
  "POST /api/v1/proposal/addto_pilot_report":
    "ProposalController.addToPilotReportUpload",
  "POST /api/v1/proposal/remove_pilot_report":
    "ProposalController.removeFromPilotReportUpload",

  // Application
  "POST /api/v1/application/create": "ApplicationsController.create",
  "POST /api/v1/application/select": "ApplicationsController.select",
  "POST /api/v1/application/select_mul": "ApplicationsController.select_mul",
  "POST /api/v1/application/count": "ApplicationsController.count",
  "POST /api/v1/application/update": "ApplicationsController.update",
  "POST /api/v1/application/delete": "ApplicationsController.delete",
  "POST /api/v1/application/delete_mul": "ApplicationsController.delete_mul",
  "POST /api/v1/application/uploads": "ApplicationsController.imageUpload",
  "POST /api/v1/application/remove_from_images":
    "ApplicationsController.removeFromImages",
  "POST /api/v1/application/add_to_images":
    "ApplicationsController.addToImages",
    "POST /api/v1/application/create_send_push_city_admin":
    "ApplicationsController.create_send_push_city_admin",

  // Smart city & Challenge Sectors
  "POST /api/v1/smart_cities_and_challenge_sectors/create":
    "SmartCityChallengeSectorController.create",
  "POST /api/v1/smart_cities_and_challenge_sectors/select":
    "SmartCityChallengeSectorController.select",
  "POST /api/v1/smart_cities_and_challenge_sectors/select_mul":
    "SmartCityChallengeSectorController.select_mul",
  "POST /api/v1/smart_cities_and_challenge_sectors/count":
    "SmartCityChallengeSectorController.count",
  "POST /api/v1/smart_cities_and_challenge_sectors/update":
    "SmartCityChallengeSectorController.update",
  "POST /api/v1/smart_cities_and_challenge_sectors/delete":
    "SmartCityChallengeSectorController.delete",
  "POST /api/v1/smart_cities_and_challenge_sectors/delete_mul":
    "SmartCityChallengeSectorController.delete_mul",
    
    
  // unsolicited proposals

  "POST /api/v1/unsolicited_proposal/create":
  "UnsolicitedproposalController.create",
  "POST /api/v1/unsolicited_proposal/select":
  "UnsolicitedproposalController.select",
  "POST /api/v1/unsolicited_proposal/select_mul":
  "UnsolicitedproposalController.select_mul",
  "POST /api/v1/unsolicited_proposal/count":
  "UnsolicitedproposalController.count",
  "POST /api/v1/unsolicited_proposal/update":
  "UnsolicitedproposalController.update",
  "POST /api/v1/unsolicited_proposal/delete":
  "UnsolicitedproposalController.delete",

  "POST /api/v1/unsolicited_proposal/create_chall_smart_uns_prop":
  "UnsolicitedproposalController.create_chall_smart_uns_prop",

  "POST /api/v1/unsolicited_proposal/create_anchor_update_uns_proposal":
  "UnsolicitedproposalController.create_anchor_update_uns_proposal",
   "POST /api/v1/unsolicited_proposal/uns_file_upload":
  "UnsolicitedproposalController.imageUpload",

  // CRON jobs
  "POST /api/v1/cron_job/kill_unverified_users":
    "CRONjobsController.killUnVerifiedUsers",

  //Auth
  "POST /api/v1/auth/login": "AuthController.login",
  "POST /api/v1/auth/refresh_token": "AuthController.refreshToken",
  "POST /api/v1/auth/testing": "AuthController.authCheck",
  
  // test route
  "POST /api/v1/auth/test-mail": "UsersController.testNotification",
  'GET /check-connection': 'ConnectionCheckController.checkConnection'

  
  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
