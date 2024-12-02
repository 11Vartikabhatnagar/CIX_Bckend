/**
 * UnsolicitedproposalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const _ = require("@sailshq/lodash");

module.exports = {

  create: async (req, res) => {
    try {
      const newAnchor = await Unsolicitedproposal.create(req.body.data).fetch();
      res.send({
        status: true,
        msg: "Unsolicited created successfully",
        data: newAnchor,
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select: async (req, res) => {
    try {
      const data = await Unsolicitedproposal.findOne({
        id: req.body.slug.id
      }).populate("frg_challenge_id").populate("frg_challenge_sector_id").populate("frg_provider_id").populate("frg_smart_city_id");

      res.send(
        data ? {
          status: true,
          msg: "Unsolicited retrieved",
          data: data
        } : {
          status: false,
          msg: "Unsolicited not found",
          data: data
        }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  select_mul: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Unsolicitedproposal.find({
        where: query.condition,
        sort: query.sort || "created_at DESC",
        limit: query.pagination.limit,
        skip: query.pagination.skip,
      }).populate("frg_challenge_id").populate("frg_challenge_sector_id").populate("frg_provider_id").populate("frg_smart_city_id")
      res.send(
        data.length > 0 ? {
          status: true,
          msg: "Unsolicited Proposals retrieved",
          data: data
        } : {
          status: false,
          msg: "No records found",
          data: data
        }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  count: async (req, res) => {
    try {
      const query = await sails.helpers.selectQueryBuilder(req.body);
      const data = await Unsolicitedproposal.count({
        where: query.condition,
      });
      res.send({
        status: true,
        msg: "Unsolicited proposal count retrieved",
        data: data
      });
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  update: async (req, res) => {
    try {
      const data = await Unsolicitedproposal.updateOne({
        where: {
          id: req.body.slug.id
        },
      }).set(req.body.data);
      res.send(
        data ?
        {
          status: true,
          msg: "Unsolicited proposal updated",
          data: data
        } :
        {
          status: false,
          msg: "Unsolicited proposal not found",
          data: data
        }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await Unsolicitedproposal.destroyOne({
        id: req.body.slug.id
      });
      res.send(
        data ?
        {
          status: true,
          msg: "Unsolicited proposal deleted successfully",
          data: data
        } :
        {
          status: false,
          msg: "Unsolicited proposal not found",
          data: data
        }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  delete_mul: async (req, res) => {
    try {
      const data = await Unsolicitedproposal.destroy({
        id: req.body.slug.ids
      }).fetch();
      res.send(
        data.length > 0 ?
        {
          status: true,
          msg: "Unsolicitedproposal deleted successfully",
          data: data
        } :
        {
          status: false,
          msg: "Unsolicitedproposal not found",
          data: data
        }
      );
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  create_chall_smart_uns_prop: async (req, res) => {
    try {
      var chall_post_data = {
        name: req.body.data.name,
        frg_challenge_sector_id: req.body.data.frg_challenge_sector_id,
        uns_proposal: req.body.data.uns_proposal,
        status: req.body.data.chall_status
      }

      try {
        let chall_res =  await Challenges.create(chall_post_data).fetch();
        if(chall_res){

          var ass_chall_smart_city_data = {
            frg_challenge_id: chall_res.id,
            frg_smart_city_id : req.body.data.frg_smart_city_id
          }
          let ass_chall_res =  await ChallengeSmartCity.create(ass_chall_smart_city_data).fetch();

          if(ass_chall_res){
            var unsol_prop_data = {
              frg_challenge_id: chall_res.id,
              frg_smart_city_id : req.body.data.frg_smart_city_id,
              frg_challenge_sector_id:chall_res.frg_challenge_sector_id,
              frg_provider_id:req.body.data.frg_provider_id,
              status:req.body.data.un_status
            }
            let unsol_prop_res =  await Unsolicitedproposal.create(unsol_prop_data).fetch();
            if(unsol_prop_res){
                res.send({ status: true, msg: "Unsolicited created successfully", chall_data: chall_res,smart_city_data:ass_chall_res, unp_data: unsol_prop_res });
                await triggerpushUnsolNotificationCityAdmin(unsol_prop_res);
            }
          }
        }
      } catch (err) {
        // res.send({ status: false, msg: "Duplicate Challenge exists", error:err});
        if(err.code === "E_UNIQUE"){
          res.send({ status: false, msg: "Duplicate Challenge exists"});
        }
        else{
          res.send({ status: false, msg: "something went wrong"});
        }

      }
    } catch (error) {
      console.log(error)
      res.send({ status: false, msg: error});
    }
  },

  create_anchor_update_uns_proposal: async (req, res) => {
    try {
      if (req.body.data.status == 'approved') {
        var anc_post_data = {
          status: "active",
          challenge_summary: req.body.data.challenge_summary,
          frg_seeker_id: req.body.data.frg_seeker_id,
          frg_challenge_id: req.body.data.frg_challenge_id,
          info_links: req.body.data.info_links,
          challenge_status :"Accepting Solutions"
        }

        const anc_data = await Anchors.create(anc_post_data).fetch();

        if (anc_data) {
          var anc_smart_post_data = {
            frg_anchor_id: anc_data.id,
            frg_smart_city_id: req.body.data.frg_smart_city_id
          }
          const anc_smart_data = await AnchorsSmartCities.create(anc_smart_post_data).fetch();

          if (anc_smart_data) {
            const uns_prop_data = await Unsolicitedproposal.update({id: req.body.data.uns_id}).set({ status: "active", frg_anchor_id: anc_data.id,sol_sub_status:true }).fetch();

            if (uns_prop_data) {
              var timestamp = new Date();

              var app_post_data = {
                "application_status":"Shortlist",
                "status": "active",
                "name": req.body.data.challenge_summary + timestamp,
                "frg_provider_id": uns_prop_data[0].frg_provider_id,
                "market_domain": [
                  "Unsolicited Proposal"
                ],
                "solution_brief": "<p>this is unsolicited proposal application solution_brief</p>" + timestamp,
                "video_link": "",
                "value_proposition": "<p>this is unsolicited proposal application value_proposition</p>" + timestamp,
                "tangible_benifits": "<p>this is unsolicited proposal application tangible_benifits</p>" + timestamp,
                "solution_advantages": "<p>this is unsolicited proposal application solution_advantages</p>" + timestamp,
                "solution_readiness": "<p>this is unsolicited proposal application solution_readiness</p>" + timestamp,
                "track_record": "<p>this is unsolicited proposal application track_record</p>" + timestamp,
                "other_details": "<p>this is unsolicited proposal application track_record</p>" + timestamp,
                "experts_involved": "<p>this is unsolicited proposal application experts_involved</p>" + timestamp,
                "implementation_time": {
                  "months": "0",
                  "weeks": "0"
                },
                "ip_details": {
                  "status": "Not Applicable",
                  "id_number": 0
                },
                "frg_anchor_id": anc_data.id,
                "frg_challenge_sector_id": uns_prop_data[0].frg_challenge_sector_id,
                "frg_challenge_id": req.body.data.frg_challenge_id
              }

              try {
              let app_resp_data = await Applications.create(app_post_data).fetch();

              if(app_resp_data){
                await triggerpushAnchorNotificationCityAdmin(app_post_data);
                res.send({
                  status: true,
                  msg: "Anchor & Application added successfully",
                  data: uns_prop_data,
                  app_res_data: app_resp_data
                });
              }
              } catch (error) {
                console.log(error)
              }

            }

          }
        }
      } else {
        const uns_prop_data = await Unsolicitedproposal.update({
          id: req.body.data.uns_id
        }).set({
          status: "inactive"
        }).fetch();
        res.send({
          status: "inactive",
          msg: "Anchor added successfully",
          data: uns_prop_data,
        });
      }
    } catch (error) {
      res.send({ status: false, msg: error});
    }
  },


  UnsFileUpload: async (req, res) => {
    try {
      const temp = await Unsolicitedproposal.findOne({ id: req.body.slug.id });
      const UnsDocs = req.file("uns_files");
      if (!temp) {
        return res.send({ status: false, msg: "Unsoliticed Proposal not found", data: [] });
      } else if (!UnsDocs._files && !req.body.UnsDocs) {
        sails.log.warn("No files uploaded");
        clearTimeout(UnsDocs.timeouts.untilMaxBufferTimer);
        clearTimeout(UnsDocs.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: UnsDocs,
          fileRelativePath: `/uploads/${Unsolicitedproposal.tableName}/${temp.id}`,
        };
        sails.log.info("doc upload started");
        const docUploads = await sails.helpers.multifileUploadHandler(fileObj);
        res.send({
          status: true,
          msg: "Docs updated successfully",
          data: await Unsolicitedproposal.update({ id: temp.id })
            .set({ uns_files: docUploads.urlPaths })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },

  imageUpload: async (req, res) => {
    console.log('yes')
    try {

      const temp = await Unsolicitedproposal.findOne({ id: req.body.slug });
      const images = req.file("uns_files");
      if (!temp) {
        return res.send({ status: false, msg: "Unsolicited Proposal not found", data: [] });
      } else if (!images._files && !req.body.uns_files) {
        sails.log.warn("No image files uploaded");
        clearTimeout(images.timeouts.untilMaxBufferTimer);
        clearTimeout(images.timeouts.untilFirstFileTimer);
        return res.send({
          status: false,
          msg: "upload files to update",
          data: [],
        });
      } else {
        const fileObj = {
          fileBLOB: images,
          fileRelativePath: `/uploads/${Unsolicitedproposal.tableName}/${temp.id}`,
        };
        sails.log.info("image upload started");
        const imageUploads = await sails.helpers.multifileUploadHandler(
          fileObj
        );
        res.send({
          status: true,
          msg: "Images updated successfully",
          data: await Unsolicitedproposal.update({ id: temp.id })
            .set({ uns_files: imageUploads.urlPaths })
            .fetch(),
        });
      }
    } catch (err) {
      await sails.helpers.errorHandler(res, err);
    }
  },


};


async function triggerpushAnchorNotificationCityAdmin(data){
  const anch_det = await Anchors.findOne({id:data.frg_anchor_id}).populate("frg_challenge_id").populate("frg_seeker_id");
  await sails.helpers.notificationHandler("ON_APP_CREATION", {
    message_payload: {
      type: "obj",
      payloads: {
        challenge_name: anch_det.frg_challenge_id.name,
        challenge_id:anch_det.frg_challenge_id.id,
        anchor_id:anch_det.id
      },
    },
    userId: anch_det.frg_seeker_id.frg_user_id,
  });
}

async function triggerpushUnsolNotificationCityAdmin(data){

  const unsol_det = await Unsolicitedproposal.findOne({id:data.id}).populate("frg_challenge_id").populate("frg_challenge_sector_id").populate("frg_provider_id").populate("frg_smart_city_id");
  const seeker_detail = await Seekers.find({frg_smart_city_id :unsol_det.frg_smart_city_id.id}).populate("frg_user_id").sort('created_at ASC');

  if(seeker_detail.length){
    seeker_detail.forEach(async (itm) => {
      await sails.helpers.notificationHandler("ON_UNS_CHALL_CREATION", {
        message_payload: {
          type: "obj",
          payloads: {
            challenge_name: unsol_det.frg_challenge_id.name,
            challenge_id:unsol_det.frg_challenge_id.id,
            unsol_id:unsol_det.id,
            user_slug:itm.slug
          },
        },
        userId: itm.frg_user_id.id,
      });
    })

  };
}