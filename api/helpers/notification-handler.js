const admin = require("../../firebase-config");
const fireStore = admin.firestore();
const timeStamp = admin.firestore.FieldValue.serverTimestamp();
const uid = require("uid");

async function notificationController(inputs) {
  // console.log(inputs)
  // console.log(inputs.messagePayload.message_payload.payloads)
  try {
    const notification = await fireStore
      .collection("notifications")
      .doc()
      .set({
        id: uid(16),
        createdAt: timeStamp,
        event: inputs.event,
        ...inputs.messagePayload,
        read: false,
      });
    sails.log.info(`notification posted ${JSON.stringify(notification)}`);
  } catch (err) {
    sails.log.error(`error posting notification ${JSON.stringify(err)}`);
  }
}

module.exports = {
  friendlyName: "Notification handler",
  description: "Firebase notification controller",
  inputs: {
    event: {
      type: "string",
      description: "notification event",
    },
    messagePayload: {
      type: "ref",
      description: "notification payloads",
    },
  },
  exits: {},
  fn: notificationController,
};
