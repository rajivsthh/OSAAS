const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if configuration is available.
// Can use either service account JSON file (local dev) or environment variables (production)
let auth = null;
let adminInstance = null;

function logMissing() {
  console.warn('⚠️  Firebase admin SDK not configured; authentication endpoints will behave as if user is unauthenticated.');
}

try {
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
    const serviceAccount = require('../serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
  }

  admin.initializeApp({ credential });
  adminInstance = admin;
  auth = admin.auth();
} catch (error) {
  logMissing();
  // Don't crash; we just leave `auth` null and let middleware handle it.
}

module.exports = {
  admin: adminInstance,
  auth,
  // Note: Firestore and Realtime Database not initialized
  // Add them if needed: db: adminInstance?.firestore(), realtimeDb: adminInstance?.database()
};
