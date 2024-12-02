/**
 * AnchorsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const MailEventsController = require("./MailEventsController");
const moment = require("moment");

module.exports = {
  create: async (req, res) => {
    try {
      const newAnchor = await Anchors.create(req.body.data).fetch();
      res.send({
        status: true,
        msg: "Anchor created successfully",
        data: newAnchor,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await Anchors.findOne({ id: req.body.slug.id })
        .populate("frg_seeker_id")
        .populate("frg_challenge_id")
        .populate("smart_cities")
        .populate("solutions")
        .populate("applications")
        .populate("proposals");
      res.send(
        data
          ? { status: true, msg: "Anchor retrieved", data: data }
          : { status: false, msg: "Anchor not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Anchors.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      })
        .populate("frg_seeker_id")
        .populate("frg_challenge_id")
        .populate("smart_cities")
        .populate("solutions")
        .populate("applications")
        .populate("proposals");
      res.send(
        data.length > 0
          ? { status: true, msg: "Anchors retrieved", data: data }
          : { status: false, msg: "No records found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Anchors.count({
        where: query.condition,
      });
      res.send({ status: true, msg: "Anchors count retrieved", data: data });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Anchors.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Anchor updated", data: data }
          : { status: false, msg: "Anchor not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await Anchors.destroyOne({ id: req.body.slug.id });
      res.send(
        data
          ? { status: true, msg: "Anchor deleted successfully", data: data }
          : { status: false, msg: "Anchor not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await Anchors.destroy({ id: req.body.slug.ids }).fetch();
      res.send(
        data.length > 0
          ? { status: true, msg: "Anchors deleted successfully", data: data }
          : { status: false, msg: "Anchors not found", data: data }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },
  
    update_anchor_push_to_city_admin: async (req, res) => {
    try {
      const data = await Anchors.updateOne({
        where: { id: req.body.slug.id },
      }).set(req.body.data);
      res.send(
        data
          ? { status: true, msg: "Anchor updated", data: data }
          : { status: false, msg: "Anchor not found", data: data }
      );
      await triggerpushAnchorNotificationCityAdmin(req.body)
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  pushNewAnchorNotification: async (req, res) => {
    try {
      const anchorData = await Anchors.findOne({ id: req.body.slug.id })
        .populate("frg_seeker_id")
        .populate("frg_challenge_id")
        .populate("smart_cities")
        .populate("solutions");
      triggerNotificationForAnchorOfOtherCity(anchorData, req);
      triggerNotificationForFollowingSector(anchorData, req);
      triggerNotificationForTaggedSolutions(anchorData, req);
      res.send({
        status: true,
        msg: "notifications sent successfully",
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  pushAnchorClosedNotification: async (req, res) => {
    try {
      const anchorData = await Anchors.findOne({ id: req.body.slug.id })
        .populate("frg_seeker_id")
        .populate("frg_challenge_id")
        .populate("smart_cities")
        .populate("solutions");
      triggerNotificationForClosedAnchor(anchorData, req);
      triggerPushNotificationForClosedAnchor(req.body.slug.id);
      res.send({
        status: true,
        msg: "notifications sent successfully",
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  }, 
};

async function triggerNotificationForAnchorOfOtherCity(anchorData, req) {
  if (anchorData.status === "active") {
    const protocol = req.connection.encrypted ? "https" : "http";
    const baseUrl = protocol + "://" + req.headers.host;
    let currentChallenge = await Challenges.findOne({
      id: anchorData.frg_challenge_id.id,
    }).populate("anchors");
    let othersAnchors = currentChallenge.anchors.filter(
      (anchor) =>
        anchorData.frg_seeker_id.id != anchor.frg_seeker_id &&
        anchor.status === "active"
    );
    const anchoredCity = anchorData.smart_cities.filter(
      (e) => e.id === anchorData.frg_seeker_id.frg_smart_city_id
    );
    othersAnchors.forEach(async (anchor) => {
      const seekerData = await Seekers.findOne({ id: anchor.frg_seeker_id })
        .populate("frg_user_id")
        .populate("frg_smart_city_id")
        .populate("challenge_sectors");
      MailEventsController.onChallengeAnchoredByOtherCity({
        user_name: seekerData.fullname.split(" ")[0],
        avatar: `${baseUrl + seekerData.avatar}`,
        email: seekerData.frg_user_id.email,
        anchored_by: anchorData.frg_seeker_id.fullname.split(" ")[0],
        anchored_for: anchoredCity[0].name,
        challenge_name: currentChallenge.name,
        posted_time: moment(anchorData.updated_at).format("D MMMM,HH:MM"),
        anchor_url: `${sails.config.globals.front_end_url}/challenge/${currentChallenge.id}/anchor/${anchorData.id}`,
      });
    });
  }
}

async function triggerNotificationForFollowingSector(anchorData, req) {
  if (anchorData.status === "active") {
    const protocol = req.connection.encrypted ? "https" : "http";
    const baseUrl = protocol + "://" + req.headers.host;
    const providerSectorData = await ChallengesectorsProviders.find({
      frg_challenge_sector_id:
        anchorData.frg_challenge_id.frg_challenge_sector_id,
    });
    const anchoredChallenge = await Challenges.findOne({
      id: anchorData.frg_challenge_id.id,
    }).populate("frg_challenge_sector_id");

    providerIdbasedOnSector = providerSectorData.map(
      (data) => data.frg_provider_id
    );
    const anchoredCity = anchorData.smart_cities.filter(
      (e) => e.id === anchorData.frg_seeker_id.frg_smart_city_id
    );
    providerIdbasedOnSector.forEach(async (e) => {
      const providerData = await Providers.findOne({ id: e }).populate(
        "frg_user_id"
      );
      MailEventsController.onNewAnchorUnderSector({
        user_name: providerData.fullname.split(" ")[0],
        avatar: `${baseUrl + providerData.avatar}`,
        email: providerData.frg_user_id.email,
        anchored_by: anchorData.frg_seeker_id.fullname.split(" ")[0],
        anchored_for: anchoredCity[0].name,
        challenge_name: anchoredChallenge.name,
        challenge_sector: anchoredChallenge.frg_challenge_sector_id.name,
        posted_time: moment(anchorData.updated_at).format("D MMMM,HH:MM"),
        anchor_url: `${sails.config.globals.front_end_url}/challenge/${anchorData.frg_challenge_id.id}/anchor/${anchorData.id}`,
        create_solution_url: `${sails.config.globals.front_end_url}/provider/user/${providerData.slug}/solutions/create`,
      });
    });
  }
}

async function triggerNotificationForTaggedSolutions(anchorData, req) {
  if (anchorData.status === "active") {
    const protocol = req.connection.encrypted ? "https" : "http";
    const baseUrl = protocol + "://" + req.headers.host;
    const anchoredChallenge = await Challenges.findOne({
      id: anchorData.frg_challenge_id.id,
    })
      .populate("frg_challenge_sector_id")
      .populate("solutions");
    const anchoredCity = anchorData.smart_cities.filter(
      (e) => e.id === anchorData.frg_seeker_id.frg_smart_city_id
    );
    anchoredChallenge.solutions.forEach(async (solution) => {
      const providerData = await Providers.findOne({
        id: solution.frg_provider_id,
      }).populate("frg_user_id");
      MailEventsController.onAnchoredUnderProviderSolution({
        user_name: providerData.fullname.split(" ")[0],
        avatar: `${baseUrl + providerData.avatar}`,
        email: providerData.frg_user_id.email,
        anchored_by: anchorData.frg_seeker_id.fullname.split(" ")[0],
        anchored_for: anchoredCity[0].name,
        challenge_name: anchoredChallenge.name,
        posted_time: moment(anchorData.updated_at).format("D MMMM,HH:MM"),
        anchor_url: `${sails.config.globals.front_end_url}/challenge/${anchorData.frg_challenge_id.id}/anchor/${anchorData.id}`,
      });
    });
  }
}

async function triggerNotificationForClosedAnchor(anchorData, req) {
  if (anchorData.status === "Closed") {
    const protocol = req.connection.encrypted ? "https" : "http";
    const baseUrl = protocol + "://" + req.headers.host;
    let currentChallenge = await Challenges.findOne({
      id: anchorData.frg_challenge_id.id,
    }).populate("anchors");
    let othersAnchors = currentChallenge.anchors.filter(
      (anchor) =>
        anchorData.frg_seeker_id.id != anchor.frg_seeker_id &&
        anchor.status === "active"
    );
    const anchoredCity = anchorData.smart_cities.filter(
      (e) => e.id === anchorData.frg_seeker_id.frg_smart_city_id
    );
    othersAnchors.forEach(async (anchor) => {
      const seekerData = await Seekers.findOne({ id: anchor.frg_seeker_id })
        .populate("frg_user_id")
        .populate("frg_smart_city_id")
        .populate("challenge_sectors");
      MailEventsController.onAnchorClosed({
        user_name: seekerData.fullname.split(" ")[0],
        avatar: `${baseUrl + seekerData.avatar}`,
        email: seekerData.frg_user_id.email,
        anchored_by: anchorData.frg_seeker_id.fullname.split(" ")[0],
        anchored_for: anchoredCity[0].name,
        challenge_name: currentChallenge.name,
        closed_time: moment(anchorData.updated_at).format("D MMMM,HH:MM"),
        anchor_url: `${sails.config.globals.front_end_url}/challenge/${currentChallenge.id}/anchor/${anchorData.id}`,
      });
    });
  }
}

async function triggerPushNotificationForClosedAnchor(data){
  const anch_det = await Anchors.findOne({id:data.id}).populate("frg_seeker_id");
  const anch_items = await Anchors.find({frg_challenge_id:anch_det.frg_challenge_id}).populate("frg_seeker_id").populate("frg_challenge_id").populate("smart_cities").populate("solutions");
  _.each(anch_items,async (item)=>{
    if(item.frg_seeker_id.id != anch_det.frg_seeker_id.id ){
      await sails.helpers.notificationHandler("ON_ANCHOR_CLOSED", {
        message_payload: {
          type: "obj",
          payloads: {
            city_name:item.smart_cities.name,
            city_admin: item.frg_seeker_id.fullname,
            challenge_name: item.frg_challenge_id.name,
            challenge_id:item.frg_challenge_id.id,
            anchor_id:item.id
          },
        },
        userId: item.frg_seeker_id.frg_user_id,
      });
    }
  })
}
