const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Can use either service account JSON file (local dev) or environment variables (production)
let credential;

if (process.env.FIREBASE_PRIVATE_KEY) {
  // Use environment variables (for deployment)
  credential = admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  });
} else {
  // Use service account JSON file (for local development)
  try {
    const serviceAccount = require('../serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
  } catch (error) {
    console.error('⚠️  Firebase service account not found. Set FIREBASE_* environment variables or add serviceAccountKey.json');
    process.exit(1);
  }
}

admin.initializeApp({ credential });

module.exports = {
  admin,
  auth: admin.auth(),
  db: admin.firestore(),
  realtimeDb: admin.database()
};
