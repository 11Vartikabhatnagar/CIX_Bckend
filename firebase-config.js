const admin = require("firebase-admin");

// Fetch the service account key JSON file contents
const serviceAccount = require("./cityinx-forge-firebase-adminsdk-p1u9t-a5059c4460.json");

// Initialize the app with a null auth variable, limiting the server's access
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
