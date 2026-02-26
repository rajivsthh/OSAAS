const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Download your service account key from Firebase Console > Project Settings > Service Accounts
// and save it as backend/serviceAccountKey.json
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  admin,
  auth: admin.auth(),
  db: admin.firestore(),
  realtimeDb: admin.database()
};
